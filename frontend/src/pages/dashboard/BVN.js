import React, { useState } from 'react';
import { FiShield, FiUser, FiCalendar, FiPhone, FiCheckCircle, FiXCircle, FiDownload } from 'react-icons/fi';
import { verifyBVN, downloadPDF } from '../../utils/api';
import toast from 'react-hot-toast';

const BVN = () => {
  const [formData, setFormData] = useState({ bvn: '', dob: '' });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [agreed, setAgreed] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agreed) {
      toast.error('Please confirm data subject consent');
      return;
    }
    if (formData.bvn.length !== 11) {
      toast.error('BVN must be exactly 11 digits');
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const res = await verifyBVN(formData);
      setResult(res.data);
      toast.success('BVN verification complete!');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (type) => {
    toast.loading('Generating PDF...', { id: 'pdf' });
    try {
      await downloadPDF(type, result.verificationId);
      toast.success(type + ' PDF downloaded!', { id: 'pdf' });
    } catch (error) {
      toast.error('Download failed', { id: 'pdf' });
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div style={{
            width: '44px', height: '44px', background: '#e8f7f1',
            borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <FiShield size={22} color="#0f5132" />
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#0f0f0d' }}>BVN Verification</h1>
        </div>
        <p style={{ color: '#6b7280', fontSize: '15px', marginLeft: '56px' }}>
          Verify a Bank Verification Number instantly using licensed KYC providers
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(300px, 480px) 1fr',
        gap: '24px', alignItems: 'start'
      }}>

        {/* Form */}
        <div className="card">
          <h2 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '20px', color: '#0f0f0d' }}>
            Enter BVN Details
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Bank Verification Number (BVN)</label>
              <div style={{ position: 'relative' }}>
                <FiShield style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                <input
                  className="form-input"
                  style={{ paddingLeft: '40px' }}
                  type="text"
                  name="bvn"
                  placeholder="Enter 11-digit BVN"
                  value={formData.bvn}
                  onChange={handleChange}
                  maxLength={11}
                  required
                />
              </div>
              <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>
                {formData.bvn.length}/11 digits
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Date of Birth</label>
              <div style={{ position: 'relative' }}>
                <FiCalendar style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                <input
                  className="form-input"
                  style={{ paddingLeft: '40px' }}
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  required
                />
              </div>
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
                I confirm that the data subject has provided consent for this
                verification per <strong>NDPR guidelines</strong>.
              </span>
            </div>

            <button type="submit" className="btn-primary" disabled={loading}
              style={{ width: '100%', justifyContent: 'center', padding: '13px', fontSize: '15px' }}>
              {loading ? (
                <div className="spinner" style={{ width: '18px', height: '18px', borderWidth: '2px' }}></div>
              ) : (
                <><FiShield /> Verify BVN Now</>
              )}
            </button>
          </form>

          <div style={{
            marginTop: '16px', padding: '10px 14px', background: '#fffbeb',
            borderRadius: '8px', border: '1px solid #fde68a',
            fontSize: '13px', color: '#d97706'
          }}>
            ⚡ This verification costs <strong>₦100</strong> from your wallet
          </div>
        </div>

        {/* Result */}
        <div>
          {!result ? (
            <div className="card" style={{
              textAlign: 'center', padding: '48px 24px',
              border: '2px dashed #e5e7eb', background: '#fafafa'
            }}>
              <FiShield size={48} color="#d1d5db" style={{ marginBottom: '16px' }} />
              <p style={{ fontSize: '16px', fontWeight: '600', color: '#9ca3af' }}>
                Verification result will appear here
              </p>
              <p style={{ fontSize: '13px', color: '#d1d5db', marginTop: '8px' }}>
                Enter a BVN and submit the form
              </p>
            </div>
          ) : (
            <div className="card" style={{
              border: result.status === 'valid' ? '2px solid #86efac' : '2px solid #fca5a5'
            }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                marginBottom: '20px', padding: '14px',
                background: result.status === 'valid' ? '#e8f7f1' : '#fef2f2',
                borderRadius: '8px'
              }}>
                {result.status === 'valid'
                  ? <FiCheckCircle size={24} color="#0f5132" />
                  : <FiXCircle size={24} color="#dc2626" />
                }
                <div>
                  <div style={{
                    fontSize: '16px', fontWeight: '700',
                    color: result.status === 'valid' ? '#0f5132' : '#dc2626'
                  }}>
                    BVN {result.status === 'valid' ? 'Verified Successfully' : 'Verification Failed'}
                  </div>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>
                    Verification ID: #{result.verificationId}
                  </div>
                </div>
              </div>

              <div style={{
                display: 'grid', gridTemplateColumns: '1fr 1fr',
                gap: '1px', background: '#e5e7eb',
                borderRadius: '8px', overflow: 'hidden', marginBottom: '16px'
              }}>
                {[
                  { label: 'Full Name', value: result.data?.full_name || (result.data?.firstName + ' ' + result.data?.lastName) || 'N/A', icon: <FiUser size={14} /> },
                  { label: 'Date of Birth', value: result.data?.dateOfBirth || result.data?.dob || 'N/A', icon: <FiCalendar size={14} /> },
                  { label: 'Phone Number', value: result.data?.phoneNumber || result.data?.phone || 'N/A', icon: <FiPhone size={14} /> },
                  { label: 'Bank Linked', value: result.data?.bankLinked || 'Active', icon: <FiCheckCircle size={14} /> },
                ].map((field, i) => (
                  <div key={i} style={{ padding: '14px 16px', background: 'white' }}>
                    <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#9ca3af', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      {field.icon} {field.label}
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: '#0f0f0d' }}>
                      {field.value}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                {['Standard', 'ID Card', 'Compliance'].map((type) => (
                  <button key={type}
                    className="btn-secondary"
                    onClick={() => handleDownload(type)}
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

export default BVN;