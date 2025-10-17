// server/routes/upload.js
const express = require('express');
const multer = require('multer');
const xml2js = require('xml2js');
const router = express.Router();
const Report = require('../models/Report');

// Configure multer for in-memory file storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

/**
 * Helper function to safely get the first element if a property is an array,
 * or return the property itself if it's an object.
 */
const getFirst = (property) => {
  if (Array.isArray(property)) {
    return property[0];
  }
  return property;
};

router.post('/', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ msg: 'No file uploaded.' });
  }

  try {
    const xmlData = req.file.buffer.toString('utf-8');
    const parser = new xml2js.Parser({ explicitArray: false });
    const result = await parser.parseStringPromise(xmlData);

    const creditReport = result.INProfileResponse;
    const allAccounts = creditReport?.CAIS_Account?.CAIS_Account_DETAILS || [];
    const firstAccount = getFirst(allAccounts);
    const firstAccountIdDetails = getFirst(firstAccount?.CAIS_Holder_ID_Details);

    // --- Data Extraction (With Type Conversion for Numbers) ---
    const processedData = {
      basicDetails: {
        name: `${creditReport?.Current_Application?.Current_Application_Details?.Current_Applicant_Details?.First_Name || ''} ${creditReport?.Current_Application?.Current_Application_Details?.Current_Applicant_Details?.Last_Name || ''}`.trim(),
        mobilePhone: creditReport?.Current_Application?.Current_Application_Details?.Current_Applicant_Details?.MobilePhoneNumber,
        pan: firstAccountIdDetails?.Income_TAX_PAN,
        // ✅ FIX: Ensure all numeric fields are parsed as integers with a default
        creditScore: parseInt(creditReport?.SCORE?.BureauScore) || 0
      },
      reportSummary: {
        totalAccounts: parseInt(creditReport?.CAIS_Account?.CAIS_Summary?.Credit_Account?.CreditAccountTotal) || 0,
        activeAccounts: parseInt(creditReport?.CAIS_Account?.CAIS_Summary?.Credit_Account?.CreditAccountActive) || 0,
        closedAccounts: parseInt(creditReport?.CAIS_Account?.CAIS_Summary?.Credit_Account?.CreditAccountClosed) || 0,
        currentBalance: parseInt(creditReport?.CAIS_Account?.CAIS_Summary?.Total_Outstanding_Balance?.Outstanding_Balance_All) || 0,
        securedBalance: parseInt(creditReport?.CAIS_Account?.CAIS_Summary?.Total_Outstanding_Balance?.Outstanding_Balance_Secured) || 0,
        unsecuredBalance: parseInt(creditReport?.CAIS_Account?.CAIS_Summary?.Total_Outstanding_Balance?.Outstanding_Balance_UnSecured) || 0,
        recentEnquiries: parseInt(creditReport?.TotalCAPS_Summary?.TotalCAPSLast7Days) || 0
      },
      accounts: allAccounts.map(acc => {
        const addressDetails = getFirst(acc?.CAIS_Holder_Address_Details);
        
        return {
          accountNumber: acc.Account_Number,
          bank: acc.Subscriber_Name?.trim(),
          // ✅ FIX: Ensure all numeric fields are parsed as integers with a default
          currentBalance: parseInt(acc.Current_Balance) || 0,
          amountOverdue: parseInt(acc.Amount_Past_Due) || 0,
          address: `${addressDetails?.First_Line_Of_Address_non_normalized || ''}, ${addressDetails?.City_non_normalized || ''}, ${addressDetails?.ZIP_Postal_Code_non_normalized || ''}`.trim()
        };
      })
    };

    // --- Data Persistence ---
    const newReport = new Report(processedData);
    await newReport.save();
    res.status(201).json(newReport);

  } catch (err) {
    console.error("ERROR PROCESSING FILE:", err); 
    res.status(500).send('Server Error: Could not process file.');
  }
});

module.exports = router;