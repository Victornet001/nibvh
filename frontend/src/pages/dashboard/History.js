import React, { useState, useEffect } from 'react';
import { FiClock, FiShield, FiUsers, FiFileText, FiDownload, FiSearch } from 'react-icons/fi';
import { getHistory, downloadPDF } from '../../utils/api';
import toast from 'react-hot-toast';


const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    getHistory()
      .then((res) => setHistory(res.data.verifications || []))
      .catch(() => toast.error('Could not load history'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = history.filter((item) => {
    const matchSearch = item.input_value.includes(search) || item.type.includes(search.toUpperCase());
    const matchFilter = filter === 'ALL' || item.type === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div style={{
            width: '44px', height: '44px', background: '#e8f7f1',
            borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <FiClock size={22} color="#0f5132" />
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#0f0f0d' }}>
            Verification History
          </h1>
        </div>
        <p style={{ color: '#6b7280', fontSize: '15px', marginLeft: '56px' }}>
          All your past verification requests
        </p>
      </div>

      {/* Filters */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <div style={{
          display: 'flex', gap: '12px', flexWrap: 'wrap',
          alignItems: 'center'
        }}>
          {/* Search */}
          <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
            <FiSearch style={{
              position: 'absolute', left: '14px',
              top: '50%', transform: 'translateY(-50%)',
              color: '#9ca3af'
            }} />
            <input
              className="form-input"
              style={{ paddingLeft: '40px' }}
              placeholder="Search by reference number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Filter Tabs */}
          <div style={{ display: 'flex', gap: '6px' }}>
            {['ALL', 'BVN', 'NIN', 'CAC'].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                style={{
                  padding: '9px 16px', borderRadius: '8px',
                  border: '1.5px solid',
                  borderColor: filter === tab ? '#0f5132' : '#e5e7eb',
                  background: filter === tab ? '#e8f7f1' : 'white',
                  color: filter === tab ? '#0f5132' : '#6b7280',
                  fontWeight: filter === tab ? '600' : '400',
                  fontSize: '13px', cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif',
                  transition: 'all 0.15s'
                }}>
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
            <div className="spinner"></div>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 24px', color: '#9ca3af' }}>
            <FiClock size={48} style={{ marginBottom: '16px', opacity: 0.4 }} />
            <p style={{ fontSize: '16px', fontWeight: '600' }}>No verifications found</p>
            <p style={{ fontSize: '13px', marginTop: '6px' }}>
              {search || filter !== 'ALL' ? 'Try changing your search or filter' : 'Start by verifying a BVN, NIN or CAC'}
            </p>
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
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {item.type === 'BVN' && <FiShield size={15} color="#1d4ed8" />}
                        {item.type === 'NIN' && <FiUsers size={15} color="#d97706" />}
                        {item.type === 'CAC' && <FiFileText size={15} color="#0f5132" />}
                        <span className={`badge ${
                          item.type === 'BVN' ? 'badge-blue' :
                          item.type === 'NIN' ? 'badge-amber' : 'badge-green'
                        }`}>
                          {item.type}
                        </span>
                      </div>
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
                    <td>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        {['PDF', 'ID Card'].map((type) => (
                          <button
                            key={type}
                            className="btn-secondary"
                            style={{ padding: '6px 10px', fontSize: '11px', gap: '4px' }}>
                            <FiDownload size={11} /> {type}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer count */}
        {!loading && filtered.length > 0 && (
          <div style={{
            padding: '12px 16px', borderTop: '1px solid #e5e7eb',
            fontSize: '13px', color: '#6b7280', background: '#fafafa'
          }}>
            Showing {filtered.length} of {history.length} verifications
          </div>
        )}
      </div>
    </div>
  );
};

export default History;