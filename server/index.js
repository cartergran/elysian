import Anthropic from '@anthropic-ai/sdk';
import 'dotenv/config';
import express from 'express';
import { fileURLToPath } from 'url';
import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import multer from 'multer';
import path from 'path';

import { requireEnvVariable } from './utils.js';
import upsertFund from './upsert.js';

const ANTHROPIC_API_KEY = requireEnvVariable('ANTHROPIC_API_KEY');
const S3_BUCKET = requireEnvVariable('S3_BUCKET');

const ANTHROPIC_MODEL = process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-20250514';
const AWS_REGION = process.env.AWS_REGION || 'us-east-1';
const EXTRACTION_PROMPT = process.env.EXTRACTION_PROMPT || 'Return an empty array [] as plain text.';
const PORT = process.env.PORT || 3001;

const OUTPUT_SCHEMA = {
  additionalProperties: false,
  type: 'object',
  properties: {
    period: { type: 'string' },
    investments: {
      additionalProperties: false,
      type: 'array',
      items: {
        additionalProperties: false,
        type: 'object',
        properties: {
          companyName: { type: 'string' },
          investmentRound: {
            type: 'object',
            properties: {
              investedCapital: { type: ['number', 'null'] },
              realizedValue: { type: ['number', 'null'] },
              unrealizedValue: { type: ['number', 'null'] },
              totalValue: { type: ['number', 'null'] },
              grossIRR: { type: ['number', 'null'] }
            },
            required: ['investedCapital', 'totalValue']
          }
        },
        required: ['companyName', 'investmentRound']
      }
    }
  },
  required: ['period', 'investments']
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const anthropic = new Anthropic({ apiKey: ANTHROPIC_API_KEY });

const app = express();

const s3 = new S3Client({ region: AWS_REGION });

const upload = multer({
  limits: {
    fileSize: 32 * 1024 * 1024 // 32MB
  },
  storage: multer.memoryStorage(),
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== '.pdf') {
      return cb(new Error('Only PDF files are allowed.'), false);
    }
    cb(null, true);
  }
});

const putPdfAndGetUrlFromS3 = async (buffer, filename) => {
  const key = `reports/${filename}`;
  const putCmd = new PutObjectCommand({
    ACL: 'private',
    Body: buffer,
    Bucket: S3_BUCKET,
    ContentType: 'application/pdf',
    Key: key,
  });
  await s3.send(putCmd);

  const getCmd = new GetObjectCommand({ Bucket: S3_BUCKET, Key: key });
  const signedUrl = getSignedUrl(s3, getCmd, { expiresIn: 3600 });

  return signedUrl;
};

const parseAnthropicResponse = (res) => {
  const toolOutput = res.content.find(obj => obj.type === 'tool_use');
  if (toolOutput) {
    return toolOutput.input;
  }

  const textOutput = res.content.find(obj => obj.type === 'text');
  if (textOutput) {
    console.log('Model returned text: ', textOutput.text);
  }

  return [];
};

const callAndParseAnthropic = async (signedUrl) => {
  const res = await anthropic.messages.create({
    max_tokens: 8000,
    model: ANTHROPIC_MODEL,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'document',
            source: {
              type: 'url',
              url: signedUrl
            }
          },
          {
            type: 'text',
            text: EXTRACTION_PROMPT
          }
        ]
      }
    ],
    tools: [
      {
        description: 'Extract a financial table from a PDF and return a JSON matching the schema.',
        input_schema: OUTPUT_SCHEMA,
        name: 'extract_financial_table',
      }
    ],
  });

  return parseAnthropicResponse(res);
};

app.post('/api/extract', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    const fundName = req.body.fundName;
    if (!file) {
      return res.status(400).json({ detail: 'No file uploaded.' });
    }
    if (!fundName) {
      return res.status(400).json({ detail: 'No fund name entered.'})
    }
    if (!S3_BUCKET) {
      return res.status(500).json({ detail: 'S3 bucket not configured.' });
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
      filename,
      message: 'PDF processed successfully',
      payload,
      size: file.size
    });

  } catch (err) {
    const errDetail = `Error processing file: ${err.message}`;
    console.error(errDetail);
    return res.status(500).json({ detail: errDetail });
  }
});

// error handling
app.use((err, _req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ detail: 'File size exceeds 32MB limit.' });
    }
    return res.status(400).json({ detail: err.message });
  }
  next(err);
});

if (process.env.NODE_ENV === 'production') {
  // serve static react files
  app.use(express.static(path.join(__dirname, '../client/dist')));

  // catch all handler
  app.get('/*splat', (_req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
