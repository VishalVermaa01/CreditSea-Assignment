// server/models/Report.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReportSchema = new Schema({
  basicDetails: {
    name: { type: String, required: true },
    mobilePhone: { type: String },
    pan: { type: String },
    creditScore: { type: Number }
  },
  reportSummary: {
    totalAccounts: { type: Number },
    activeAccounts: { type: Number },
    closedAccounts: { type: Number },
    currentBalance: { type: Number },
    securedBalance: { type: Number },
    unsecuredBalance: { type: Number },
    recentEnquiries: { type: Number }
  },
  accounts: [
    {
      accountNumber: { type: String },
      bank: { type: String },
      currentBalance: { type: Number },
      amountOverdue: { type: Number },
      address: { type: String }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Report', ReportSchema);