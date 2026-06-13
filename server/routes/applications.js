const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const dataPath = path.join(__dirname, '../data/applications.json');

function readData() {
  return JSON.parse(fs.readFileSync(dataPath, 'utf8'));
}
function writeData(data) {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
}

// GET all applications
router.get('/', (req, res) => {
  const data = readData();
  res.json(data.applications);
});

// GET application by ID
router.get('/:id', (req, res) => {
  const data = readData();
  const app = data.applications.find(a => a.id === req.params.id);
  if (!app) return res.status(404).json({ error: 'Application not found' });
  res.json(app);
});

// POST create new application
router.post('/', (req, res) => {
  const { bank, scheme, amount, applicantName, businessName, extractedData } = req.body;
  const bankShort = bank.replace(/\s+/g, '').substring(0, 3).toUpperCase();
  const id = `LM-${new Date().getFullYear()}-${bankShort}-${Math.floor(1000 + Math.random() * 9000)}`;
  
  const newApp = {
    id,
    bank,
    scheme,
    amount: parseFloat(amount),
    status: 'submitted',
    progress: 10,
    submittedAt: new Date().toISOString().split('T')[0],
    updatedAt: new Date().toISOString().split('T')[0],
    applicantName,
    businessName,
    extractedData: extractedData || {},
    timeline: [
      { step: 'Application Submitted', date: new Date().toISOString().split('T')[0], done: true },
      { step: 'Document Verification', date: null, done: false },
      { step: 'Credit Assessment', date: null, done: false },
      { step: 'Loan Approved', date: null, done: false },
      { step: 'Disbursement', date: null, done: false }
    ]
  };

  const data = readData();
  data.applications.push(newApp);
  writeData(data);

  res.status(201).json(newApp);
});

// PATCH update application status
router.patch('/:id/status', (req, res) => {
  const { status, progress } = req.body;
  const data = readData();
  const idx = data.applications.findIndex(a => a.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });

  data.applications[idx].status = status;
  data.applications[idx].progress = progress;
  data.applications[idx].updatedAt = new Date().toISOString().split('T')[0];
  writeData(data);

  res.json(data.applications[idx]);
});

module.exports = router;
