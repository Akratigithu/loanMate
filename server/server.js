const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from root
app.use(express.static(path.join(__dirname, '..')));

// File upload config
const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

// API Routes
app.use('/api/schemes', require('./routes/schemes'));
app.use('/api/applications', require('./routes/applications'));
app.use('/api/chat', require('./routes/chat'));

// Document upload endpoint
app.post('/api/upload', upload.single('document'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  const docType = req.body.documentType || 'aadhaar';
  
  // Simulate processing
  setTimeout(() => {
    res.json({
      success: true,
      filename: req.file.originalname,
      size: req.file.size,
      mimeType: req.file.mimetype,
      documentType: docType,
      message: 'Document received. Extracting information...'
    });
  }, 500);
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), service: 'LoanMate API' });
});

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`\n🚀 LoanMate Server running at http://localhost:${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api`);
  console.log(`\nPress Ctrl+C to stop\n`);
});
