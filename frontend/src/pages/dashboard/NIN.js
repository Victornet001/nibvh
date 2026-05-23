import React, { useState } from 'react';
import { FiUsers, FiUser, FiCalendar, FiPhone, FiCheckCircle, FiXCircle, FiDownload } from 'react-icons/fi';
import { verifyNIN } from '../../utils/api';
import toast from 'react-hot-toast';
import { downloadPDF } from '../../utils/api';

const NIN = () => {
  const [formData, setFormData] = useState({ nin: '' });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [agreed, setAgreed] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agreed) {
      toast.error('Please confirm data subject consent');
      return;
    }
    if (formData.nin.length !== 11) {
      toast.error('NIN must be exactly 11 digits');
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const res = await verifyNIN(formData);
      setResult(res.data);
      toast.success('NIN verification complete!');
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
          <div style={{
            width: '44px', height: '44px', background: '#eff6ff',
            borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <FiUsers size={22} color="#1d4ed8" />
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#0f0f0d' }}>NIN Verification</h1>
        </div>
        <p style={{ color: '#6b7280', fontSize: '15px', marginLeft: '56px' }}>
          Verify a National Identity Number from NIMC records
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 480px) 1fr', gap: '24px', alignItems: 'start' }}>
        <div className="card">
          <h2 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '20px' }}>Enter NIN Details</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">National Identity Number (NIN)</label>
              <div style={{ position: 'relative' }}>
                <FiUsers style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                <input
                  className="form-input"
                  style={{ paddingLeft: '40px' }}
                  type="text"
                  name="nin"
                  placeholder="Enter 11-digit NIN"
                  value={formData.nin}
                  onChange={(e) => setFormData({ nin: e.target.value })}
                  maxLength={11}
                  required
                />
              </div>
              <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>{formData.nin.length}/11 digits</div>
            </div>

            <div style={{
              display: 'flex', alignItems: 'flex-start', gap: '12px',
              marginBottom: '24px', padding: '14px',
              background: '#f8faf9', borderRadius: '8px', border: '1px solid #e5e7eb'
            }}>
              <label className="toggle" style={{ flexShrink: 0, marginTop: '2px' }}>
                <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
                <span className="toggle-slider"></span>
              </label>
              <span style={{ fontSize: '13px', color: '#6b7280', lineHeight: '1.6' }}>
                I confirm the data subject has provided consent per <strong>NDPR guidelines</strong>.
              </span>
            </div>

            <button type="submit" className="btn-primary" disabled={loading}
              style={{ width: '100%', justifyContent: 'center', padding: '13px', fontSize: '15px', background: '#1d4ed8' }}>
              {loading ? 'Verifying...' : <><FiUsers /> Verify NIN Now</>}
            </button>
          </form>
          <div style={{ marginTop: '16px', padding: '10px 14px', background: '#fffbeb', borderRadius: '8px', border: '1px solid #fde68a', fontSize: '13px', color: '#d97706' }}>
            ⚡ This verification costs <strong>₦100</strong> from your wallet
          </div>
        </div>

        <div>
          {!result ? (
            <div className="card" style={{ textAlign: 'center', padding: '48px 24px', border: '2px dashed #e5e7eb', background: '#fafafa' }}>
              <FiUsers size={48} color="#d1d5db" style={{ marginBottom: '16px' }} />
              <p style={{ fontSize: '16px', fontWeight: '600', color: '#9ca3af' }}>Verification result will appear here</p>
            </div>
          ) : (
            <div className="card" style={{ border: result.status === 'valid' ? '2px solid #86efac' : '2px solid #fca5a5' }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px',
                padding: '14px', background: result.status === 'valid' ? '#e8f7f1' : '#fef2f2', borderRadius: '8px'
              }}>
                {result.status === 'valid' ? <FiCheckCircle size={24} color="#0f5132" /> : <FiXCircle size={24} color="#dc2626" />}
                <div>
                  <div style={{ fontSize: '16px', fontWeight: '700', color: result.status === 'valid' ? '#0f5132' : '#dc2626' }}>
                    NIN {result.status === 'valid' ? 'Verified Successfully' : 'Verification Failed'}
                  </div>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>Verification ID: #{result.verificationId}</div>
                </div>
              </div>

              {result.data?.photo && (
                <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                  <img src={`data:image/jpeg;base64,${result.data.photo}`} alt="ID"
                    style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #0f5132' }} />
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', background: '#e5e7eb', borderRadius: '8px', overflow: 'hidden', marginBottom: '16px' }}>
                {[
                  { label: 'Full Name', value: result.data?.full_name || 'N/A', icon: <FiUser size={14} /> },
                  { label: 'Gender', value: result.data?.gender || 'N/A', icon: <FiUser size={14} /> },
                  { label: 'Date of Birth', value: result.data?.birthdate || 'N/A', icon: <FiCalendar size={14} /> },
                  { label: 'Phone Number', value: result.data?.phone || 'N/A', icon: <FiPhone size={14} /> },
                ].map((field, i) => (
                  <div key={i} style={{ padding: '14px 16px', background: 'white' }}>
                    <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#9ca3af', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      {field.icon} {field.label}
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: '#0f0f0d' }}>{field.value}</div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
  {['Standard', 'ID Card', 'Compliance'].map((type) => (
    <button key={type}
      className="btn-secondary"
      onClick={() => {
        toast.loading(`Generating ${type} PDF...`, { id: 'pdf' });
        downloadPDF(type, result.verificationId)
          .then(() => toast.success(`${type} PDF downloaded!`, { id: 'pdf' }))
          .catch(() => toast.error('Download failed', { id: 'pdf' }));
      }}
      style={{ padding: '9px', fontSize: '12px', justifyContent: 'center' }}>
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

export default NIN;