// client/src/components/ReportDisplay.jsx
import React from 'react';

// Simple, presentational component that displays the parsed report data.
// Keeps rendering defensive: if a value is missing we display a placeholder.
const ReportDisplay = ({ data }) => {
  if (!data) return null;

  const { basicDetails = {}, reportSummary = {}, accounts = [] } = data;

  const fmt = (val) => (val == null || val === '' ? '—' : val);
  const fmtCurrency = (val) => (val == null ? '—' : `₹${Number(val).toLocaleString('en-IN')}`);

  return (
    <div className="report-container">
      <div className="card">
        <h3>Basic Details</h3>
        <p><strong>Name:</strong> {fmt(basicDetails.name)}</p>
        <p>
          <strong>Credit Score:</strong>{' '}
          <span className="score">{fmt(basicDetails.creditScore)}</span>
        </p>
        <p><strong>PAN:</strong> {fmt(basicDetails.pan)}</p>
        <p><strong>Mobile:</strong> {fmt(basicDetails.mobilePhone)}</p>
      </div>

      <div className="card">
        <h3>Report Summary</h3>
        <p>
          <strong>Total Accounts:</strong> {fmt(reportSummary.totalAccounts)} 
          <span className="muted"> ({fmt(reportSummary.activeAccounts)} active, {fmt(reportSummary.closedAccounts)} closed)</span>
        </p>
        <p><strong>Total Balance:</strong> {fmtCurrency(reportSummary.currentBalance)}</p>
        <p><strong>Secured Balance:</strong> {fmtCurrency(reportSummary.securedBalance)}</p>
        <p><strong>Unsecured Balance:</strong> {fmtCurrency(reportSummary.unsecuredBalance)}</p>
      </div>

      <div className="card full-width">
        <h3>Credit Accounts Information</h3>
        {accounts.length === 0 ? (
          <p className="message">No accounts available in the report.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Bank</th>
                  <th>Account No</th>
                  <th>Current Balance</th>
                  <th>Amount Overdue</th>
                  <th>Address</th>
                </tr>
              </thead>
              <tbody>
                {accounts.map((acc, index) => (
                  <tr key={index}>
                    <td>{fmt(acc.bank)}</td>
                    <td>{fmt(acc.accountNumber)}</td>
                    <td>{fmtCurrency(acc.currentBalance)}</td>
                    <td className={acc.amountOverdue > 0 ? 'overdue' : ''}>{fmtCurrency(acc.amountOverdue)}</td>
                    <td>{fmt(acc.address)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportDisplay;