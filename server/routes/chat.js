const express = require('express');
const router = express.Router();

// Simulate AI chat responses
const CONVERSATION_FLOWS = {
  greeting: {
    message: "👋 Hello! I'm LoanMate, your AI loan assistant. I'll help you find the best government loan scheme for your business. Let's start — what type of business do you run?",
    chips: ['Manufacturing', 'Retail / Trade', 'Service Business', 'Agriculture-linked'],
    nextStep: 'businessType'
  },
  businessType: (type) => ({
    message: `Great! You run a ${type} business. To find the best scheme for you, I need a few details. What is your approximate annual turnover?`,
    chips: ['Less than ₹5 Lakhs', '₹5L – ₹25L', '₹25L – ₹1 Crore', 'Above ₹1 Crore'],
    nextStep: 'turnover'
  }),
  turnover: (range) => {
    let turnoverValue = 200000;
    if (range.includes('5L – ₹25L')) turnoverValue = 1000000;
    else if (range.includes('25L – ₹1')) turnoverValue = 5000000;
    else if (range.includes('Above')) turnoverValue = 50000000;
    return {
      message: `Got it. Do you have a valid CIBIL score above 650?`,
      chips: ['Yes, above 750', 'Yes, 650-750', 'Below 650', "Don't know"],
      nextStep: 'cibil',
      data: { turnover: turnoverValue }
    };
  },
  cibil: (answer) => {
    let cibilValue = 700;
    if (answer.includes('750')) cibilValue = 760;
    else if (answer.includes('650-750')) cibilValue = 700;
    else if (answer.includes('Below')) cibilValue = 600;
    return {
      message: `Do you have any existing loan defaults or NPAs in the last 2 years?`,
      chips: ['No defaults', 'Have 1 default', 'Multiple defaults'],
      nextStep: 'defaults',
      data: { cibil: cibilValue }
    };
  },
  defaults: (answer) => ({
    message: `Almost done! Do you have valid Aadhaar and PAN card?`,
    chips: ['Yes, both', 'Only Aadhaar', 'Only PAN', 'Neither'],
    nextStep: 'documents',
    data: { hasDefault: !answer.includes('No defaults') }
  }),
  documents: (answer) => ({
    message: `Perfect. Let me now analyze your eligibility across all schemes...`,
    chips: [],
    nextStep: 'eligibility',
    data: { hasAadhaar: answer.includes('both') || answer.includes('Aadhaar'), hasPan: answer.includes('both') || answer.includes('PAN') },
    action: 'check_eligibility'
  }),
  uploadPrompt: {
    message: `📄 Would you like me to auto-fill your loan application? Just upload your documents and I'll extract the information automatically.`,
    chips: ['Upload Documents', 'Fill Manually', 'Skip for Now'],
    nextStep: 'upload'
  },
  uploadDone: (docName) => ({
    message: `✅ I've successfully extracted information from your ${docName}. Here's what I found:`,
    nextStep: 'confirm_extraction',
    action: 'show_extracted'
  }),
  trackStatus: {
    message: `🔍 Let me check your loan application status. Please share your application reference number, or I can show all your applications.`,
    chips: ['Show All Applications', 'Enter Reference Number'],
    nextStep: 'status_check'
  }
};

router.post('/message', (req, res) => {
  const { message, step, sessionData } = req.body;
  
  // Simple response logic
  let response = {
    type: 'text',
    message: "I'm processing your request...",
    chips: [],
    nextStep: step
  };

  if (!step || step === 'greeting' || message.toLowerCase().includes('hello') || message.toLowerCase().includes('hi')) {
    response = { ...CONVERSATION_FLOWS.greeting, type: 'text' };
  } else if (step === 'businessType') {
    const flow = CONVERSATION_FLOWS.businessType(message);
    response = { ...flow, type: 'text' };
  } else if (step === 'turnover') {
    const flow = CONVERSATION_FLOWS.turnover(message);
    response = { ...flow, type: 'text' };
  } else if (step === 'cibil') {
    const flow = CONVERSATION_FLOWS.cibil(message);
    response = { ...flow, type: 'text' };
  } else if (step === 'defaults') {
    const flow = CONVERSATION_FLOWS.defaults(message);
    response = { ...flow, type: 'text' };
  } else if (step === 'documents') {
    const flow = CONVERSATION_FLOWS.documents(message);
    response = { ...flow, type: 'text' };
  } else if (message.toLowerCase().includes('track') || message.toLowerCase().includes('status') || message.toLowerCase().includes('disburs')) {
    response = { ...CONVERSATION_FLOWS.trackStatus, type: 'text' };
  } else if (message.toLowerCase().includes('upload') || message.toLowerCase().includes('document')) {
    response = { ...CONVERSATION_FLOWS.uploadPrompt, type: 'text' };
  } else if (message.toLowerCase().includes('apply') || message.toLowerCase().includes('start')) {
    response = { ...CONVERSATION_FLOWS.greeting, type: 'text' };
  } else {
    response = {
      type: 'text',
      message: `I can help you with:\n• 🎯 **Check Loan Eligibility** — Find schemes you qualify for\n• 📄 **Auto-fill Applications** — Upload documents to fill forms\n• 📊 **Track Status** — Monitor your loan disbursement\n\nWhat would you like to do?`,
      chips: ['Check Eligibility', 'Upload Documents', 'Track My Loan'],
      nextStep: 'menu'
    };
  }

  setTimeout(() => res.json(response), 800); // Simulate processing delay
});

// Simulate document OCR extraction
router.post('/extract', (req, res) => {
  const { documentType } = req.body;
  
  const extractedData = {
    aadhaar: {
      name: 'Ravi Kumar',
      dob: '1985-03-15',
      address: '24, MG Road, Bengaluru - 560001',
      aadhaarNumber: 'XXXX XXXX 4821',
      gender: 'Male',
      confidence: 97
    },
    pan: {
      name: 'RAVI KUMAR',
      panNumber: 'ABCPK1234D',
      dob: '15/03/1985',
      fatherName: 'SURESH KUMAR',
      confidence: 99
    },
    gst: {
      businessName: 'Ravi Enterprises',
      gstin: '29ABCPK1234D1Z5',
      state: 'Karnataka',
      registrationDate: '2020-04-01',
      businessType: 'Regular',
      annualTurnover: '₹18,50,000',
      confidence: 95
    },
    bankStatement: {
      accountHolder: 'Ravi Kumar',
      bankName: 'State Bank of India',
      accountNumber: 'XXXX XXXX 7890',
      averageMonthlyBalance: '₹45,000',
      monthlyInflow: '₹1,85,000',
      creditScore: 'Not Available',
      confidence: 93
    }
  };

  const docData = extractedData[documentType] || extractedData.aadhaar;
  
  setTimeout(() => res.json({ 
    success: true, 
    documentType,
    extractedData: docData,
    processingTime: '2.3s'
  }), 1500);
});

module.exports = router;
