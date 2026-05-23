import React, { useState } from 'react';
import { FiFileText, FiCheckCircle, FiXCircle, FiDownload, FiHash } from 'react-icons/fi';
import { verifyCAC, downloadPDF } from '../../utils/api';
import toast from 'react-hot-toast';

const CAC = () => {
  const [rcNumber, setRcNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [agreed, setAgreed] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agreed) {
      toast.error('Please confirm consent');
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const res = await verifyCAC({ rc_number: rcNumber });
      setResult(res.data);
      toast.success('CAC verification complete!');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div style={{ width: '44px', height: '44px', background: '#fffbeb', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FiFileText size={22} color="#d97706" />
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#0f0f0d' }}>CAC Verification</h1>
        </div>
        <p style={{ color: '#6b7280', fontSize: '15px', marginLeft: '56px' }}>
          Verify registered businesses and company records from CAC
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 480px) 1fr', gap: '24px', alignItems: 'start' }}>
        <div className="card">
          <h2 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '20px' }}>Enter RC Number</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">CAC Registration Number (RC Number)</label>
              <div style={{ position: 'relative' }}>
                <FiHash style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                <input
                  className="form-input"
                  style={{ paddingLeft: '40px' }}
                  type="text"
                  placeholder="e.g. RC-0012345"
                  value={rcNumber}
                  onChange={(e) => setRcNumber(e.target.value)}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '24px', padding: '14px', background: '#f8faf9', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
              <label className="toggle" style={{ flexShrink: 0, marginTop: '2px' }}>
                <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
                <span className="toggle-slider"></span>
              </label>
              <span style={{ fontSize: '13px', color: '#6b7280', lineHeight: '1.6' }}>
                I confirm this verification is for legitimate business purposes per <strong>NDPR guidelines</strong>.
              </span>
            </div>

            <button type="submit" className="btn-primary" disabled={loading}
              style={{ width: '100%', justifyContent: 'center', padding: '13px', fontSize: '15px', background: '#d97706' }}>
              {loading ? 'Verifying...' : <><FiFileText /> Verify CAC Now</>}
            </button>
          </form>
          <div style={{ marginTop: '16px', padding: '10px 14px', background: '#fffbeb', borderRadius: '8px', border: '1px solid #fde68a', fontSize: '13px', color: '#d97706' }}>
            ⚡ This verification costs <strong>₦200</strong> from your wallet
          </div>
        </div>

        <div>
          {!result ? (
            <div className="card" style={{ textAlign: 'center', padding: '48px 24px', border: '2px dashed #e5e7eb', background: '#fafafa' }}>
              <FiFileText size={48} color="#d1d5db" style={{ marginBottom: '16px' }} />
              <p style={{ fontSize: '16px', fontWeight: '600', color: '#9ca3af' }}>Verification result will appear here</p>
            </div>
          ) : (
            <div className="card" style={{ border: result.status === 'valid' ? '2px solid #86efac' : '2px solid #fca5a5' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', padding: '14px', background: result.status === 'valid' ? '#e8f7f1' : '#fef2f2', borderRadius: '8px' }}>
                {result.status === 'valid' ? <FiCheckCircle size={24} color="#0f5132" /> : <FiXCircle size={24} color="#dc2626" />}
                <div>
                  <div style={{ fontSize: '16px', fontWeight: '700', color: result.status === 'valid' ? '#0f5132' : '#dc2626' }}>
                    CAC {result.status === 'valid' ? 'Verified Successfully' : 'Verification Failed'}
                  </div>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>Verification ID: #{result.verificationId}</div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', background: '#e5e7eb', borderRadius: '8px', overflow: 'hidden', marginBottom: '16px' }}>
                {[
                  { label: 'Company Name', value: result.data?.company_name || 'N/A' },
                  { label: 'RC Number', value: result.data?.rc_number || rcNumber },
                  { label: 'Business Type', value: result.data?.type || 'N/A' },
                  { label: 'Registration Date', value: result.data?.registration_date || 'N/A' },
                  { label: 'Company Status', value: result.data?.status || 'Active' },
                  { label: 'State', value: result.data?.state || 'N/A' },
                ].map((field, i) => (
                  <div key={i} style={{ padding: '14px 16px', background: 'white' }}>
                    <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#9ca3af', marginBottom: '4px' }}>{field.label}</div>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: '#0f0f0d' }}>{field.value}</div>
                  </div>
                ))}
              </div>

              {result.data?.directors && result.data.directors.length > 0 && (
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>Directors</div>
                  {result.data.directors.map((d, i) => (
                    <div key={i} style={{ padding: '8px 12px', background: '#f8faf9', borderRadius: '6px', fontSize: '13px', marginBottom: '4px' }}>
                      {d.name || d}
                    </div>
                  ))}
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                {['Standard', 'ID Card', 'Compliance'].map((type) => (
                  <button key={type} className="btn-secondary" style={{ padding: '9px', fontSize: '12px', justifyContent: 'center' }}>
                    <FiDownload size={13} /> {type}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CAC;