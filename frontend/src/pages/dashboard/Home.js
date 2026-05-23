import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiShield, FiUsers, FiFileText, FiDollarSign, FiArrowRight, FiClock } from 'react-icons/fi';
import { getHistory, getWallet, getTransactions } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [wallet, setWallet] = useState(null);
  const [, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getHistory(), getWallet(), getTransactions()])
      .then(([histRes, walletRes, transRes]) => {
        setHistory(histRes.data.verifications || []);
        setWallet(walletRes.data.wallet);
        setTransactions(transRes.data.transactions || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const bvnCount = history.filter(h => h.type === 'BVN').length;
  const ninCount = history.filter(h => h.type === 'NIN').length;
  const cacCount = history.filter(h => h.type === 'CAC').length;

  const stats = [
    { label: 'Wallet Balance', value: `₦${parseFloat(wallet?.balance || 0).toLocaleString()}`, icon: <FiDollarSign size={22} />, color: '#0f5132', bg: '#e8f7f1', path: '/dashboard/wallet' },
    { label: 'BVN Checks', value: bvnCount, icon: <FiShield size={22} />, color: '#1d4ed8', bg: '#eff6ff', path: '/dashboard/bvn' },
    { label: 'NIN Checks', value: ninCount, icon: <FiUsers size={22} />, color: '#d97706', bg: '#fffbeb', path: '/dashboard/nin' },
    { label: 'CAC Lookups', value: cacCount, icon: <FiFileText size={22} />, color: '#7c3aed', bg: '#f5f3ff', path: '/dashboard/cac' },
  ];

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
      <div className="spinner"></div>
    </div>
  );

  return (
    <div>
      {/* Welcome */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#0f0f0d', marginBottom: '6px' }}>
          Welcome back, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p style={{ color: '#6b7280', fontSize: '15px' }}>
          Here's an overview of your verification activity
        </p>
      </div>

      {/* Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px', marginBottom: '32px'
      }}>
        {stats.map((stat, i) => (
          <div key={i} className="card" style={{
            cursor: 'pointer', transition: 'all 0.2s',
            display: 'flex', alignItems: 'center', gap: '16px'
          }}
            onClick={() => navigate(stat.path)}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={{
              width: '48px', height: '48px', background: stat.bg,
              borderRadius: '12px', display: 'flex', alignItems: 'center',
              justifyContent: 'center', flexShrink: 0, color: stat.color
            }}>
              {stat.icon}
            </div>
            <div>
              <div style={{ fontSize: '22px', fontWeight: '800', color: '#0f0f0d' }}>{stat.value}</div>
              <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '2px' }}>{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px', color: '#0f0f0d' }}>
          Quick Actions
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px' }}>
          {[
            { label: 'Verify BVN', path: '/dashboard/bvn', color: '#0f5132', bg: '#e8f7f1' },
            { label: 'Verify NIN', path: '/dashboard/nin', color: '#1d4ed8', bg: '#eff6ff' },
            { label: 'Verify CAC', path: '/dashboard/cac', color: '#d97706', bg: '#fffbeb' },
            { label: 'Fund Wallet', path: '/dashboard/wallet', color: '#7c3aed', bg: '#f5f3ff' },
          ].map((action, i) => (
            <button key={i}
              onClick={() => navigate(action.path)}
              style={{
                padding: '14px', borderRadius: '10px',
                border: `1.5px solid ${action.color}20`,
                background: action.bg, cursor: 'pointer',
                display: 'flex', alignItems: 'center',
                justifyContent: 'space-between',
                color: action.color, fontWeight: '600',
                fontSize: '14px', fontFamily: 'Inter, sans-serif',
                transition: 'all 0.15s'
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              {action.label}
              <FiArrowRight size={16} />
            </button>
          ))}
        </div>
      </div>

      {/* Recent History */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#0f0f0d', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FiClock size={18} color="#0f5132" /> Recent Verifications
          </h2>
          <button
            onClick={() => navigate('/dashboard/history')}
            style={{ background: 'none', border: 'none', color: '#0f5132', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
            View all →
          </button>
        </div>

        {history.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#9ca3af' }}>
            <FiShield size={40} style={{ marginBottom: '12px', opacity: 0.4 }} />
            <p style={{ fontSize: '15px' }}>No verifications yet</p>
            <p style={{ fontSize: '13px', marginTop: '4px' }}>Start by verifying a BVN, NIN or CAC</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Reference</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {history.slice(0, 5).map((item) => (
                  <tr key={item.id}>
                    <td>
                      <span className={`badge ${item.type === 'BVN' ? 'badge-blue' : item.type === 'NIN' ? 'badge-amber' : 'badge-green'}`}>
                        {item.type}
                      </span>
                    </td>
                    <td style={{ fontFamily: 'monospace', fontSize: '13px', color: '#6b7280' }}>
                      {item.input_value}
                    </td>
                    <td>
                      <span className={`badge ${item.status === 'valid' ? 'badge-green' : 'badge-red'}`}>
                        {item.status}
                      </span>
                    </td>
                    <td style={{ fontSize: '13px', color: '#6b7280' }}>
                      {new Date(item.created_at).toLocaleDateString()}
                    </td>
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

export default Home;