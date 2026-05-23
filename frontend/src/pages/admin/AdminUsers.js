import React, { useState, useEffect } from 'react';
import { FiUsers, FiSearch, FiDollarSign } from 'react-icons/fi';
import { getAdminUsers, creditUserWallet } from '../../utils/api';
import toast from 'react-hot-toast';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [creditAmount, setCreditAmount] = useState('');
  const [crediting, setCrediting] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    getAdminUsers()
      .then((res) => setUsers(res.data.users || []))
      .catch(() => toast.error('Could not load users'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleCredit = async (e) => {
    e.preventDefault();
    if (!creditAmount || creditAmount < 1) {
      toast.error('Enter a valid amount');
      return;
    }
    setCrediting(true);
    try {
      await creditUserWallet({
        userId: selectedUser.id,
        amount: parseFloat(creditAmount),
        description: 'Admin wallet credit'
      });
      toast.success(`₦${creditAmount} credited to ${selectedUser.name}`);
      setShowModal(false);
      setCreditAmount('');
      setSelectedUser(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Credit failed');
    } finally {
      setCrediting(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div style={{ width: '44px', height: '44px', background: '#eff6ff', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FiUsers size={22} color="#1d4ed8" />
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#0f0f0d' }}>Manage Users</h1>
        </div>
        <p style={{ color: '#6b7280', fontSize: '15px', marginLeft: '56px' }}>
          View all users and manage their wallets
        </p>
      </div>

      {/* Search */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <div style={{ position: 'relative' }}>
          <FiSearch style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
          <input
            className="form-input"
            style={{ paddingLeft: '40px' }}
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
            <div className="spinner"></div>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 24px', color: '#9ca3af' }}>
            <FiUsers size={48} style={{ marginBottom: '16px', opacity: 0.4 }} />
            <p style={{ fontSize: '16px', fontWeight: '600' }}>No users found</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          width: '36px', height: '36px', background: '#e8f7f1',
                          borderRadius: '50%', display: 'flex', alignItems: 'center',
                          justifyContent: 'center', fontWeight: '700',
                          fontSize: '14px', color: '#0f5132', flexShrink: 0
                        }}>
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontSize: '14px', fontWeight: '500' }}>{u.name}</div>
                          <div style={{ fontSize: '12px', color: '#9ca3af' }}>{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${u.role === 'admin' ? 'badge-amber' : 'badge-green'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td style={{ fontSize: '13px', color: '#6b7280' }}>
                      {new Date(u.created_at).toLocaleDateString('en-NG', {
                        day: 'numeric', month: 'short', year: 'numeric'
                      })}
                    </td>
                    <td>
                      <button
                        className="btn-primary"
                        style={{ padding: '7px 14px', fontSize: '12px', gap: '5px' }}
                        onClick={() => { setSelectedUser(u); setShowModal(true); }}>
                        <FiDollarSign size={13} /> Credit Wallet
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <div style={{ padding: '12px 16px', borderTop: '1px solid #e5e7eb', fontSize: '13px', color: '#6b7280', background: '#fafafa' }}>
            {filtered.length} of {users.length} users
          </div>
        )}
      </div>

      {/* Credit Modal */}
      {showModal && selectedUser && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, padding: '24px'
        }}>
          <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '32px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '6px' }}>Credit Wallet</h2>
            <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '24px' }}>
              Adding credits to <strong>{selectedUser.name}</strong>
            </p>

            <form onSubmit={handleCredit}>
              <div className="form-group">
                <label className="form-label">Amount (₦)</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', fontWeight: '600' }}>₦</span>
                  <input
                    className="form-input"
                    style={{ paddingLeft: '30px' }}
                    type="number"
                    placeholder="Enter amount"
                    value={creditAmount}
                    onChange={(e) => setCreditAmount(e.target.value)}
                    min={1}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="button" onClick={() => setShowModal(false)}
                  className="btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary"
                  disabled={crediting} style={{ flex: 1, justifyContent: 'center' }}>
                  {crediting ? 'Crediting...' : 'Credit Now'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;