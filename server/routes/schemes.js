const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const schemesData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/schemes.json'), 'utf8'));

// GET all schemes
router.get('/', (req, res) => {
  res.json(schemesData.schemes);
});

// GET all banks
router.get('/banks', (req, res) => {
  res.json(schemesData.banks);
});

// GET scheme by ID
router.get('/:id', (req, res) => {
  const scheme = schemesData.schemes.find(s => s.id === req.params.id);
  if (!scheme) return res.status(404).json({ error: 'Scheme not found' });
  res.json(scheme);
});

// POST check eligibility
router.post('/eligibility', (req, res) => {
  const { businessType, turnover, cibilScore, employeeCount, hasGst, hasAadhaar, hasPan, hasDefault } = req.body;
  
  const results = schemesData.schemes.map(scheme => {
    let eligible = true;
    let reasons = [];
    let score = 100;

    if (hasDefault) {
      eligible = false;
      reasons.push('Existing loan default detected');
      score -= 40;
    }
    if (turnover && turnover > scheme.maxTurnover) {
      eligible = false;
      reasons.push(`Turnover exceeds scheme limit of ₹${(scheme.maxTurnover/100000).toFixed(0)} lakhs`);
      score -= 30;
    }
    if (cibilScore && scheme.minCibil > 0 && cibilScore < scheme.minCibil) {
      eligible = false;
      reasons.push(`CIBIL score ${cibilScore} below minimum ${scheme.minCibil}`);
      score -= 25;
    }
    if (!hasAadhaar || !hasPan) {
      eligible = false;
      reasons.push('Aadhaar and PAN required');
      score -= 20;
    }

    return {
      schemeId: scheme.id,
      schemeName: scheme.name,
      eligible,
      score: Math.max(0, score),
      reasons,
      loanLimit: scheme.loanLimit,
      interestRate: scheme.interestRate
    };
  });

  res.json({ results, timestamp: new Date().toISOString() });
});

module.exports = router;
