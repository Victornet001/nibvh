import React, { useState } from 'react';
import { FiUser, FiMail, FiShield, FiCopy, FiCheck } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const apiKey = `nibvh_live_${user?.id}_${btoa(user?.email || '').slice(0, 16)}`;

  const copyApiKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    toast.success('API key copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div style={{ width: '44px', height: '44px', background: '#e8f7f1', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FiUser size={22} color="#0f5132" />
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#0f0f0d' }}>My Profile</h1>
        </div>
        <p style={{ color: '#6b7280', fontSize: '15px', marginLeft: '56px' }}>
          Manage your account details
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>

        {/* Profile Card */}
        <div className="card">
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{
              width: '80px', height: '80px', background: '#0f5132',
              borderRadius: '50%', display: 'flex', alignItems: 'center',
              justifyContent: 'center', margin: '0 auto 16px',
              fontSize: '32px', fontWeight: '800', color: 'white'
            }}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#0f0f0d' }}>{user?.name}</h2>
            <span className={`badge ${user?.role === 'admin' ? 'badge-amber' : 'badge-green'}`} style={{ marginTop: '8px' }}>
              {user?.role}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { icon: <FiUser size={16} />, label: 'Full Name', value: user?.name },
              { icon: <FiMail size={16} />, label: 'Email', value: user?.email },
              { icon: <FiShield size={16} />, label: 'Account Type', value: user?.role },
            ].map((item, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '12px 14px', background: '#f8faf9',
                borderRadius: '8px', border: '1px solid #e5e7eb'
              }}>
                <span style={{ color: '#0f5132' }}>{item.icon}</span>
                <div>
                  <div style={{ fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{item.label}</div>
                  <div style={{ fontSize: '14px', fontWeight: '500', color: '#0f0f0d', marginTop: '2px' }}>{item.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* API Key Card */}
        <div className="card">
          <h2 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '6px' }}>Your API Key</h2>
          <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '20px' }}>
            Use this key to access NIBVH API directly from your application
          </p>

          <div style={{
            background: '#f8faf9', border: '1.5px solid #e5e7eb',
            borderRadius: '10px', padding: '16px',
            marginBottom: '12px'
          }}>
            <div style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Live API Key
            </div>
            <div style={{
              fontFamily: 'monospace', fontSize: '13px',
              color: '#0f0f0d', wordBreak: 'break-all',
              lineHeight: '1.6'
            }}>
              {apiKey}
            </div>
          </div>

          <button
            onClick={copyApiKey}
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center' }}>
            {copied ? <><FiCheck /> Copied!</> : <><FiCopy /> Copy API Key</>}
          </button>

          <div style={{
            marginTop: '16px', padding: '12px 14px',
            background: '#fef2f2', borderRadius: '8px',
            border: '1px solid #fca5a5',
            fontSize: '13px', color: '#dc2626'
          }}>
            ⚠️ Keep your API key secret. Never share it publicly.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;