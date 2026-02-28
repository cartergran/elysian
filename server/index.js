import 'dotenv/config';
import express from 'express';
import { fileURLToPath } from 'url';
import multer from 'multer';
import path from 'path';

import authMiddleware from './middleware/auth.js';
import authRouter from './routes/auth.js';
import callAndParseAnthropic from './services/model.js';
import getFunds from './services/query.js';
import { MESSAGES } from './constants/messages.js';
import putPdfAndGetUrlFromS3 from './services/bucket.js';
import { securityMiddleware } from './middleware/security.js';
import upsertFund from './services/upsert.js';

const PORT = process.env.PORT || 3001;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

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

    const filename = req.file.originalname;
    console.log('filename:', filename);

    const signedUrl = await putPdfAndGetUrlFromS3(req.file.buffer, filename);
    const { period, investments } = await callAndParseAnthropic(signedUrl);
    const payload = {
      fundName,
      period,
      investments,
    };
    // console.log('payload:', payload);
    await upsertFund(payload);

    /*
    const fileBuffer = req.file.buffer;
    let base64Pdf;
    try {
      base64Pdf = fileBuffer.toString('base64');
    } catch (err) {
      const errDetail = `Error encoding PDF: ${err.message}`;
      console.error(errDetail);
      return res.status(500).json({ detail: errDetail });
    }
    */

    res.json({
      message: MESSAGES.REPORT_PROCESSED_SUCCESS,
      size: file.size
    });

  } catch (err) {
    const errDetail = `Error processing file: ${err.message}`;
    console.error(errDetail);
    return res.status(500).json({ detail: errDetail });
  }
});

app.get('/api/funds', authMiddleware, async (_req, res) => {
  try {
    const funds = await getFunds();
    res.json(funds);
  } catch(err) {
    const errDetail = `Error fetching funds: ${err.message}`;
    console.error(errDetail);
    return res.status(500).json({ detail: errDetail });
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

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
