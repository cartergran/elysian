import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const PORT = process.env.PORT || 3001;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

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

app.post('/api/extract', upload.single('file'), (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ detail: 'No file uploaded.' });
    }

    const filename = req.file.originalname;
    console.log('filename:', filename);

    const fileBuffer = req.file.buffer;
    let base64Pdf;
    try {
      base64Pdf = fileBuffer.toString('base64');
    } catch (err) {
      const errDetail = `Error encoding PDF: ${err.message}`;
      console.error(errDetail);
      return res.status(500).json({ detail: errDetail });
    }

    res.json({
      filename,
      message: 'PDF processed successfully',
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
      return res.status(400).json({ detail: 'File size exceeds 32MB limit.'})
    }
    return res.status(400).json({ detail: err.message })
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
