import 'dotenv/config';
import express from 'express';
import { fileURLToPath } from 'url';
import multer from 'multer';
import path from 'path';

import authMiddleware from './middleware/auth.js';
import authRouter from './routes/auth.js';
import callAndParseAnthropic, { isRateLimitError } from './services/model.js';
import getFunds, { CONNECTION_ERROR_CODES } from './services/query.js';
import {
  JOB_STATUS,
  completeJob,
  createJob,
  ensureJobLogTable,
  failJob,
  getJob,
} from './services/jobs.js';
import { MESSAGES } from './constants/messages.js';
import putPdfAndGetUrlFromS3 from './services/bucket.js';
import { securityMiddleware } from './middleware/security.js';
import upsertFund from './services/upsert.js';

const PORT = process.env.PORT || 3001;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// trust heroku proxy for rate limit
app.set('trust proxy', 1);

app.use(express.json());
app.use(securityMiddleware());
app.use('/api/auth', authRouter);

const upload = multer({
  limits: {
    fileSize: 32 * 1024 * 1024 // 32MB
  },
  storage: multer.memoryStorage(),
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== '.pdf') {
      return cb(new Error(MESSAGES.ONLY_PDF_ALLOWED), false);
    }
    cb(null, true);
  }
});

/**
 * - heavy lifting runs in the background so the initial POST
 * always responds well within Heroku's 30-second request timeout
 */
async function processExtraction(jobId, signedUrl, fundName) {
  try {
    const { period, investments } = await callAndParseAnthropic(signedUrl);
    await upsertFund({ fundName, period, investments });
    await completeJob(jobId);
    console.log(`Job ${jobId} completed`);
  } catch (err) {
    console.error(`Job ${jobId} failed: ${err.message}`);
    const message = isRateLimitError(err) ? MESSAGES.RATE_LIMIT_EXCEEDED : err.message;
    await failJob(jobId, message);
  }
}

/**
 * POST /api/extract
 * 1. validates inputs and uploads the PDF to S3 (fast — typically < 10s)
 * 2. creates a job record and responds 202 immediately
 * 3. runs Claude extraction + DB upsert in the background
 */
app.post('/api/extract', authMiddleware, upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    const fundName = req.body.fundName;

    if (!file) {
      return res.status(400).json({ detail: MESSAGES.NO_FILE_UPLOADED });
    }
    if (!fundName) {
      return res.status(400).json({ detail: MESSAGES.NO_FUND_NAME_ENTERED });
    }

    const filename = file.originalname;
    console.log('filename:', filename);

    // S3 upload is fast enough to do synchronously before responding
    const signedUrl = await putPdfAndGetUrlFromS3(file.buffer, filename);

    const jobId = await createJob(fundName);

    // Respond immediately — Claude + DB work runs after the response is sent
    res.status(202).json({ jobId });

    processExtraction(jobId, signedUrl, fundName).catch((err) => {
      console.error(`Unhandled background error for job ${jobId}: ${err.message}`);
    });

  } catch (err) {
    console.error(`Error initiating extraction: ${err.message}`);
    return res.status(500).json({ detail: `Error initiating extraction: ${err.message}` });
  }
});

/**
 * GET /api/jobs/:id
 * - returns the current status of an extraction job
 * - clients poll this until status is 'done' or 'error'
 */
app.get('/api/jobs/:id', authMiddleware, async (req, res) => {
  try {
    const job = await getJob(req.params.id);

    if (!job) {
      return res.status(404).json({ detail: MESSAGES.JOB_NOT_FOUND });
    }

    if (job.status === JOB_STATUS.DONE) {
      return res.json({ status: job.status, message: MESSAGES.REPORT_PROCESSED_SUCCESS });
    }

    if (job.status === JOB_STATUS.ERROR) {
      return res.json({
        status: job.status,
        detail: job.error_msg || MESSAGES.JOB_PROCESSING_FAILED
      });
    }

    return res.json({ status: job.status });
  } catch (err) {
    console.error(`Error fetching job: ${err.message}`);
    return res.status(500).json({ detail: `Error fetching job: ${err.message}` });
  }
});

app.get('/api/funds', authMiddleware, async (_req, res) => {
  try {
    const funds = await getFunds();
    res.json(funds);
  } catch(err) {
    const errDetail = `Error fetching funds: ${err.message}`;
    console.error(errDetail);

    const isConnectionError = CONNECTION_ERROR_CODES.has(err.code);
    const status = isConnectionError ? 503 : 500;

    return res.status(status).json({
      detail: errDetail,
      ...(isConnectionError && { error_type: 'DB_UNREACHABLE' })
    });
  }
});

// error handling
app.use((err, _req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ detail: MESSAGES.FILE_SIZE_EXCEEDED });
    }
    return res.status(400).json({ detail: err.message });
  }
  next(err);
});

if (process.env.NODE_ENV === 'production') {
  const clientDist = path.resolve(__dirname, '../client/dist');
  // serve static react files
  app.use(
    express.static(clientDist, {
      dotfiles: 'ignore',
      index: false
    })
  );

 // serve index.html only for routes without a file extension
  app.get(/^\/(?!.*\.[a-z0-9]+$).*/i, (_req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'));
  });

  // 404 fallback for other routes
  app.use((_req, res) => {
    res.sendStatus(404);
  });
}

app.listen(PORT, async () => {
  console.log(`Server listening on ${PORT}`);
  try {
    await ensureJobLogTable();
    console.log('job_log table ready');
  } catch (err) {
    console.error('Failed to ensure job_log table:', err.message);
  }
});
