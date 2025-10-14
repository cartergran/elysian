import 'dotenv/config';
import express from 'express';
import { fileURLToPath } from 'url';
import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import multer from 'multer';
import path from 'path';

const AWS_REGION = process.env.AWS_REGION || 'us-east-1';
const PORT = process.env.PORT || 3001;
const S3_BUCKET = process.env.S3_BUCKET || '';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const s3 = new S3Client({ region: AWS_REGION });

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 32 * 1024 * 1024 // 32MB
  },
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

app.post('/api/extract', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ detail: 'No file uploaded.' });
    }
    if (!S3_BUCKET) {
      return res.status(500).json({ detail: 'S3 bucket not configured.' });
    }

    const filename = req.file.originalname;
    console.log('filename:', filename);

    const signedUrl = await putPdfAndGetUrlFromS3(req.file.buffer, filename);

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
      size: file.size,
      signedUrl
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
