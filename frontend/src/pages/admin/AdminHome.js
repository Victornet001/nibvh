import React, { useState, useEffect } from 'react';
import { FiUsers, FiShield, FiDollarSign, FiActivity } from 'react-icons/fi';
import { getAdminStats, getAdminVerifications } from '../../utils/api';
import toast from 'react-hot-toast';

const AdminHome = () => {
  const [stats, setStats] = useState(null);
  const [verifications, setVerifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getAdminStats(), getAdminVerifications()])
      .then(([statsRes, verRes]) => {
        setStats(statsRes.data);
        setVerifications(verRes.data.verifications || []);
      })
      .catch(() => toast.error('Could not load admin data'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
      <div className="spinner"></div>
    </div>
  );

  const statCards = [
    { label: 'Total Users', value: stats?.totalUsers || 0, icon: <FiUsers size={22} />, color: '#1d4ed8', bg: '#eff6ff' },
    { label: 'Total Verifications', value: stats?.totalVerifications || 0, icon: <FiShield size={22} />, color: '#0f5132', bg: '#e8f7f1' },
    { label: 'Total Revenue', value: `₦${(stats?.totalRevenue || 0).toLocaleString()}`, icon: <FiDollarSign size={22} />, color: '#d97706', bg: '#fffbeb' },
    { label: 'Today\'s Verifications', value: stats?.todayVerifications || 0, icon: <FiActivity size={22} />, color: '#7c3aed', bg: '#f5f3ff' },
  ];

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#0f0f0d', marginBottom: '6px' }}>
          Admin Dashboard
        </h1>
        <p style={{ color: '#6b7280', fontSize: '15px' }}>
          Platform overview and management
        </p>
      </div>

      {/* Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px', marginBottom: '32px'
      }}>
        {statCards.map((stat, i) => (
          <div key={i} className="card" style={{
            display: 'flex', alignItems: 'center', gap: '16px'
          }}>
            <div style={{
              width: '52px', height: '52px', background: stat.bg,
              borderRadius: '12px', display: 'flex', alignItems: 'center',
              justifyContent: 'center', flexShrink: 0, color: stat.color
            }}>
              {stat.icon}
            </div>
            <div>
              <div style={{ fontSize: '24px', fontWeight: '800', color: '#0f0f0d' }}>{stat.value}</div>
              <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '2px' }}>{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Verifications */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #e5e7eb' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#0f0f0d' }}>
            Recent Verifications
          </h2>
        </div>

        {verifications.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 24px', color: '#9ca3af' }}>
            <FiShield size={48} style={{ marginBottom: '16px', opacity: 0.4 }} />
            <p style={{ fontSize: '16px', fontWeight: '600' }}>No verifications yet</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Type</th>
                  <th>Reference</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {verifications.slice(0, 10).map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div style={{ fontSize: '14px', fontWeight: '500' }}>{item.name}</div>
                      <div style={{ fontSize: '12px', color: '#9ca3af' }}>{item.email}</div>
                    </td>
                    <td>
                      <span className={`badge ${
                        item.type === 'BVN' ? 'badge-blue' :
                        item.type === 'NIN' ? 'badge-amber' : 'badge-green'
                      }`}>
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
                      {new Date(item.created_at).toLocaleDateString('en-NG', {
                        day: 'numeric', month: 'short', year: 'numeric'
                      })}
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

export default AdminHome;