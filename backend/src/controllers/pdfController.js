const puppeteer = require('puppeteer');
const { getVerificationById } = require('../models/verificationModel');
const path = require('path');
const fs = require('fs');

// Make sure reports folder exists
const reportsDir = path.join(__dirname, '../../reports');
if (!fs.existsSync(reportsDir)) {
  fs.mkdirSync(reportsDir, { recursive: true });
}

const generateStandardReport = async (req, res) => {
  const { verificationId } = req.params;

  try {
    const verification = await getVerificationById(verificationId);
    if (!verification) {
      return res.status(404).json({ message: 'Verification not found' });
    }

    const data = JSON.parse(verification.response_json);
    const verData = data.data || {};
    const timestamp = new Date(verification.created_at).toLocaleString('en-NG');

    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: 'Helvetica Neue', Arial, sans-serif;
          color: #0f0f0d;
          background: white;
          padding: 40px;
        }
        .header {
          background: linear-gradient(135deg, #0f5132, #1a7a55);
          color: white;
          padding: 32px 40px;
          border-radius: 12px;
          margin-bottom: 32px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .logo { font-size: 28px; font-weight: 900; letter-spacing: -1px; }
        .logo-sub { font-size: 12px; opacity: 0.8; margin-top: 4px; }
        .report-title { text-align: right; }
        .report-title h2 { font-size: 20px; font-weight: 700; }
        .report-title p { font-size: 12px; opacity: 0.8; margin-top: 4px; }
        .status-box {
          border-radius: 10px;
          padding: 20px 24px;
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .status-valid { background: #e8f7f1; border: 2px solid #86efac; }
        .status-invalid { background: #fef2f2; border: 2px solid #fca5a5; }
        .status-dot {
          width: 16px; height: 16px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .dot-valid { background: #0f5132; }
        .dot-invalid { background: #dc2626; }
        .status-text { font-size: 18px; font-weight: 700; }
        .status-valid .status-text { color: #0f5132; }
        .status-invalid .status-text { color: #dc2626; }
        .section { margin-bottom: 28px; }
        .section-title {
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          color: #9ca3af;
          font-weight: 600;
          margin-bottom: 12px;
          padding-bottom: 8px;
          border-bottom: 1px solid #e5e7eb;
        }
        .data-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1px;
          background: #e5e7eb;
          border-radius: 10px;
          overflow: hidden;
        }
        .data-cell {
          background: white;
          padding: 14px 18px;
        }
        .data-label {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: #9ca3af;
          margin-bottom: 4px;
        }
        .data-value {
          font-size: 15px;
          font-weight: 600;
          color: #0f0f0d;
        }
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .footer-left { font-size: 12px; color: #9ca3af; }
        .footer-right { font-size: 12px; color: #9ca3af; text-align: right; }
        .badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          background: #e8f7f1;
          color: #0f5132;
        }
        .verification-id {
          font-family: monospace;
          font-size: 13px;
          color: #6b7280;
          background: #f8faf9;
          padding: 4px 10px;
          border-radius: 6px;
        }
      </style>
    </head>
    <body>
      <!-- Header -->
      <div class="header">
        <div>
          <div class="logo">NIBVH</div>
          <div class="logo-sub">Nigeria Identity & Business Verification Hub</div>
        </div>
        <div class="report-title">
          <h2>Verification Report</h2>
          <p>Standard Format</p>
        </div>
      </div>

      <!-- Status -->
      <div class="status-box ${verification.status === 'valid' ? 'status-valid' : 'status-invalid'}">
        <div class="status-dot ${verification.status === 'valid' ? 'dot-valid' : 'dot-invalid'}"></div>
        <div>
          <div class="status-text">
            ${verification.type} ${verification.status === 'valid' ? 'Verified Successfully' : 'Verification Failed'}
          </div>
          <div style="font-size: 13px; color: #6b7280; margin-top: 4px;">
            Verified on ${timestamp}
          </div>
        </div>
        <div style="margin-left: auto;">
          <span class="badge">${verification.type}</span>
        </div>
      </div>

      <!-- Verification Details -->
      <div class="section">
        <div class="section-title">Verification Details</div>
        <div class="data-grid">
          <div class="data-cell">
            <div class="data-label">Verification ID</div>
            <div class="data-value">#${verification.id}</div>
          </div>
          <div class="data-cell">
            <div class="data-label">Verification Type</div>
            <div class="data-value">${verification.type}</div>
          </div>
          <div class="data-cell">
            <div class="data-label">Reference Number</div>
            <div class="data-value">${verification.input_value}</div>
          </div>
          <div class="data-cell">
            <div class="data-label">Status</div>
            <div class="data-value" style="color: ${verification.status === 'valid' ? '#0f5132' : '#dc2626'}">
              ${verification.status.toUpperCase()}
            </div>
          </div>
        </div>
      </div>

      <!-- Personal Details -->
      <div class="section">
        <div class="section-title">Personal Information</div>
        <div class="data-grid">
          <div class="data-cell">
            <div class="data-label">Full Name</div>
            <div class="data-value">${verData.full_name || verData.firstName + ' ' + verData.lastName || verData.company_name || 'N/A'}</div>
          </div>
          <div class="data-cell">
            <div class="data-label">Date of Birth / Reg Date</div>
            <div class="data-value">${verData.dateOfBirth || verData.dob || verData.registration_date || 'N/A'}</div>
          </div>
          <div class="data-cell">
            <div class="data-label">Phone Number</div>
            <div class="data-value">${verData.phoneNumber || verData.phone || 'N/A'}</div>
          </div>
          <div class="data-cell">
            <div class="data-label">Gender / Business Type</div>
            <div class="data-value">${verData.gender || verData.type || 'N/A'}</div>
          </div>
        </div>
      </div>

      <!-- Compliance Note -->
      <div class="section">
        <div class="section-title">Compliance Information</div>
        <div style="background: #f8faf9; border: 1px solid #e5e7eb; border-radius: 10px; padding: 16px 20px; font-size: 13px; color: #6b7280; line-height: 1.7;">
          This verification was conducted through NIBVH platform using licensed KYC API providers. 
          Data was retrieved from authorized sources and is presented as-is. 
          NIBVH does not generate, modify, or store identity data beyond what is required for compliance purposes. 
          This report is NDPR compliant and should be treated as confidential.
        </div>
      </div>

      <!-- Footer -->
      <div class="footer">
        <div class="footer-left">
          <div style="font-weight: 600; color: #0f0f0d; margin-bottom: 2px;">NIBVH — Nigeria Identity & Business Verification Hub</div>
          <div>This document is system generated and valid without signature</div>
          <div style="margin-top: 4px;">Generated: ${timestamp}</div>
        </div>
        <div class="footer-right">
          <div class="verification-id">ID: NIBVH-${verification.id}-${Date.now()}</div>
          <div style="margin-top: 6px;">© ${new Date().getFullYear()} NIBVH. All rights reserved.</div>
        </div>
      </div>
    </body>
    </html>
    `;

    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '20px', bottom: '20px', left: '20px', right: '20px' }
    });

    await browser.close();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=NIBVH-${verification.type}-${verification.id}.pdf`);
    res.send(pdfBuffer);

  } catch (error) {
    console.error('PDF generation error:', error);
    res.status(500).json({ message: 'PDF generation failed', error: error.message });
  }
};

const generateIDCardReport = async (req, res) => {
  const { verificationId } = req.params;

  try {
    const verification = await getVerificationById(verificationId);
    if (!verification) {
      return res.status(404).json({ message: 'Verification not found' });
    }

    const data = JSON.parse(verification.response_json);
    const verData = data.data || {};
    const timestamp = new Date(verification.created_at).toLocaleString('en-NG');
    const fullName = verData.full_name ||
      (verData.firstName ? `${verData.firstName} ${verData.lastName}` : null) ||
      verData.company_name || 'N/A';

    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: 'Helvetica Neue', Arial, sans-serif;
          background: #f8faf9;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          padding: 40px;
        }
        .card-wrapper { width: 100%; max-width: 600px; }
        .id-card {
          background: linear-gradient(135deg, #0f5132 0%, #1a7a55 60%, #0f5132 100%);
          border-radius: 20px;
          padding: 32px;
          color: white;
          box-shadow: 0 20px 40px rgba(15,81,50,0.3);
          position: relative;
          overflow: hidden;
        }
        .id-card::before {
          content: '';
          position: absolute;
          top: -60px; right: -60px;
          width: 200px; height: 200px;
          background: rgba(255,255,255,0.05);
          border-radius: 50%;
        }
        .id-card::after {
          content: '';
          position: absolute;
          bottom: -40px; left: -40px;
          width: 150px; height: 150px;
          background: rgba(255,255,255,0.05);
          border-radius: 50%;
        }
        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 28px;
        }
        .card-logo { font-size: 22px; font-weight: 900; letter-spacing: -0.5px; }
        .card-logo-sub { font-size: 10px; opacity: 0.7; margin-top: 2px; }
        .verified-badge {
          background: rgba(255,255,255,0.2);
          border: 1px solid rgba(255,255,255,0.3);
          border-radius: 20px;
          padding: 4px 12px;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.5px;
        }
        .card-body {
          display: flex;
          gap: 24px;
          align-items: center;
          margin-bottom: 28px;
        }
        .avatar {
          width: 80px; height: 80px;
          border-radius: 50%;
          background: rgba(255,255,255,0.2);
          border: 3px solid rgba(255,255,255,0.4);
          display: flex; align-items: center; justify-content: center;
          font-size: 32px; font-weight: 800;
          flex-shrink: 0;
        }
        .card-name { font-size: 24px; font-weight: 800; margin-bottom: 6px; letter-spacing: -0.5px; }
        .card-type {
          background: rgba(255,255,255,0.2);
          display: inline-block;
          padding: 3px 10px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.5px;
          margin-bottom: 10px;
        }
        .card-ref { font-size: 13px; opacity: 0.8; font-family: monospace; }
        .card-footer {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          padding-top: 20px;
          border-top: 1px solid rgba(255,255,255,0.2);
        }
        .footer-item { }
        .footer-label { font-size: 9px; text-transform: uppercase; letter-spacing: 0.8px; opacity: 0.6; margin-bottom: 3px; }
        .footer-value { font-size: 12px; font-weight: 600; }
        .status-row {
          margin-top: 24px;
          background: rgba(255,255,255,0.1);
          border-radius: 10px;
          padding: 12px 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 12px;
        }
        .status-dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: #86efac;
          display: inline-block;
          margin-right: 6px;
        }
      </style>
    </head>
    <body>
      <div class="card-wrapper">
        <div class="id-card">
          <!-- Header -->
          <div class="card-header">
            <div>
              <div class="card-logo">NIBVH</div>
              <div class="card-logo-sub">Nigeria Identity & Business Verification Hub</div>
            </div>
            <div class="verified-badge">✓ VERIFIED</div>
          </div>

          <!-- Body -->
          <div class="card-body">
            <div class="avatar">
              ${fullName.charAt(0).toUpperCase()}
            </div>
            <div>
              <div class="card-type">${verification.type} VERIFICATION</div>
              <div class="card-name">${fullName}</div>
              <div class="card-ref">${verification.input_value}</div>
            </div>
          </div>

          <!-- Footer Details -->
          <div class="card-footer">
            <div class="footer-item">
              <div class="footer-label">Date of Birth</div>
              <div class="footer-value">${verData.dateOfBirth || verData.dob || verData.registration_date || 'N/A'}</div>
            </div>
            <div class="footer-item">
              <div class="footer-label">Phone</div>
              <div class="footer-value">${verData.phoneNumber || verData.phone || 'N/A'}</div>
            </div>
            <div class="footer-item">
              <div class="footer-label">Gender</div>
              <div class="footer-value">${verData.gender || verData.type || 'N/A'}</div>
            </div>
          </div>

          <!-- Status Row -->
          <div class="status-row">
            <div>
              <span class="status-dot"></span>
              Status: <strong>${verification.status.toUpperCase()}</strong>
            </div>
            <div>Verified: ${timestamp}</div>
            <div>ID: #${verification.id}</div>
          </div>
        </div>
      </div>
    </body>
    </html>
    `;

    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    await page.setViewport({ width: 700, height: 500 });

    const pdfBuffer = await page.pdf({
      width: '700px',
      height: '500px',
      printBackground: true,
    });

    await browser.close();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=NIBVH-IDCard-${verification.id}.pdf`);
    res.send(pdfBuffer);

  } catch (error) {
    console.error('PDF generation error:', error);
    res.status(500).json({ message: 'PDF generation failed', error: error.message });
  }
};

const generateComplianceReport = async (req, res) => {
  const { verificationId } = req.params;

  try {
    const verification = await getVerificationById(verificationId);
    if (!verification) {
      return res.status(404).json({ message: 'Verification not found' });
    }

    const data = JSON.parse(verification.response_json);
    const timestamp = new Date(verification.created_at).toLocaleString('en-NG');

    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #0f0f0d; padding: 40px; }
        .header {
          background: linear-gradient(135deg, #0f5132, #1a7a55);
          color: white; padding: 32px 40px;
          border-radius: 12px; margin-bottom: 32px;
        }
        .header h1 { font-size: 24px; font-weight: 900; margin-bottom: 4px; }
        .header p { font-size: 13px; opacity: 0.8; }
        .section { margin-bottom: 28px; }
        .section-title {
          font-size: 13px; text-transform: uppercase;
          letter-spacing: 0.8px; color: #9ca3af;
          font-weight: 600; margin-bottom: 12px;
          padding-bottom: 8px; border-bottom: 1px solid #e5e7eb;
        }
        .info-row {
          display: flex; padding: 10px 0;
          border-bottom: 1px solid #f3f4f6;
          font-size: 13px;
        }
        .info-label { width: 200px; color: #6b7280; font-weight: 500; flex-shrink: 0; }
        .info-value { color: #0f0f0d; font-weight: 600; flex: 1; }
        .json-box {
          background: #f8faf9; border: 1px solid #e5e7eb;
          border-radius: 10px; padding: 16px;
          font-family: monospace; font-size: 11px;
          color: #374151; line-height: 1.8;
          white-space: pre-wrap; word-break: break-all;
          max-height: 300px; overflow: auto;
        }
        .compliance-box {
          background: #e8f7f1; border: 1px solid #86efac;
          border-radius: 10px; padding: 16px 20px;
          font-size: 13px; color: #0f5132; line-height: 1.7;
        }
        .footer {
          margin-top: 40px; padding-top: 20px;
          border-top: 1px solid #e5e7eb;
          font-size: 12px; color: #9ca3af;
          display: flex; justify-content: space-between;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>NIBVH Compliance Report</h1>
        <p>Detailed Audit Report — Confidential Document</p>
      </div>

      <div class="section">
        <div class="section-title">Verification Metadata</div>
        <div class="info-row"><div class="info-label">Verification ID</div><div class="info-value">#${verification.id}</div></div>
        <div class="info-row"><div class="info-label">Verification Type</div><div class="info-value">${verification.type}</div></div>
        <div class="info-row"><div class="info-label">Input Reference</div><div class="info-value">${verification.input_value}</div></div>
        <div class="info-row"><div class="info-label">Status</div><div class="info-value" style="color:${verification.status === 'valid' ? '#0f5132' : '#dc2626'}">${verification.status.toUpperCase()}</div></div>
        <div class="info-row"><div class="info-label">Timestamp</div><div class="info-value">${timestamp}</div></div>
        <div class="info-row"><div class="info-label">User ID</div><div class="info-value">#${verification.user_id}</div></div>
      </div>

      <div class="section">
        <div class="section-title">Raw API Response</div>
        <div class="json-box">${JSON.stringify(data, null, 2)}</div>
      </div>

      <div class="section">
        <div class="section-title">Compliance Statement</div>
        <div class="compliance-box">
          This verification was conducted by NIBVH (Nigeria Identity & Business Verification Hub) 
          using licensed KYC API providers in compliance with NDPR (Nigeria Data Protection Regulation). 
          The data subject provided explicit consent prior to verification. 
          Data retrieved is from authorized government sources and has not been modified. 
          This report serves as an official audit record and should be stored securely.
          <br/><br/>
          <strong>Data Retention:</strong> Per NDPR guidelines, this record will be retained for the legally required period.<br/>
          <strong>Purpose:</strong> Identity verification for compliance and fraud prevention purposes.<br/>
          <strong>Legal Basis:</strong> Consent obtained from data subject.
        </div>
      </div>

      <div class="footer">
        <div>
          <div style="font-weight:600;color:#0f0f0d">NIBVH — Nigeria Identity & Business Verification Hub</div>
          <div style="margin-top:2px">Generated: ${timestamp}</div>
        </div>
        <div style="text-align:right">
          <div>Report ID: NIBVH-COMP-${verification.id}-${Date.now()}</div>
          <div style="margin-top:2px">© ${new Date().getFullYear()} NIBVH. Confidential.</div>
        </div>
      </div>
    </body>
    </html>
    `;

    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '20px', bottom: '20px', left: '20px', right: '20px' }
    });

    await browser.close();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=NIBVH-Compliance-${verification.id}.pdf`);
    res.send(pdfBuffer);

  } catch (error) {
    console.error('PDF generation error:', error);
    res.status(500).json({ message: 'PDF generation failed', error: error.message });
  }
};

module.exports = { generateStandardReport, generateIDCardReport, generateComplianceReport };