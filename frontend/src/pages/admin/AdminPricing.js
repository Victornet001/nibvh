import React, { useState, useEffect } from 'react';
import { FiSettings, FiEdit2, FiCheck, FiX } from 'react-icons/fi';
import { getAdminPricing, updateAdminPricing } from '../../utils/api';
import toast from 'react-hot-toast';

const AdminPricing = () => {
  const [pricing, setPricing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [newPrice, setNewPrice] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getAdminPricing()
      .then((res) => setPricing(res.data.pricing || []))
      .catch(() => toast.error('Could not load pricing'))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (type) => {
    if (!newPrice || newPrice < 1) {
      toast.error('Enter a valid price');
      return;
    }
    setSaving(true);
    try {
      await updateAdminPricing({ verification_type: type, price: parseFloat(newPrice) });
      setPricing(pricing.map((p) =>
        p.verification_type === type ? { ...p, price: newPrice } : p
      ));
      toast.success(`${type} price updated to ₦${newPrice}`);
      setEditing(null);
      setNewPrice('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const colors = {
    BVN: { color: '#1d4ed8', bg: '#eff6ff' },
    NIN: { color: '#d97706', bg: '#fffbeb' },
    CAC: { color: '#0f5132', bg: '#e8f7f1' },
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div style={{ width: '44px', height: '44px', background: '#e8f7f1', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FiSettings size={22} color="#0f5132" />
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#0f0f0d' }}>Manage Pricing</h1>
        </div>
        <p style={{ color: '#6b7280', fontSize: '15px', marginLeft: '56px' }}>
          Set the price for each verification type
        </p>
      </div>

      {/* Info Banner */}
      <div style={{
        padding: '14px 18px', background: '#fffbeb',
        border: '1.5px solid #fde68a', borderRadius: '10px',
        fontSize: '14px', color: '#d97706', marginBottom: '24px',
        display: 'flex', alignItems: 'center', gap: '8px'
      }}>
        ⚡ Changes take effect immediately for all new verifications.
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
          <div className="spinner"></div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          {pricing.map((item) => {
            const c = colors[item.verification_type] || { color: '#0f5132', bg: '#e8f7f1' };
            const isEditing = editing === item.verification_type;

            return (
              <div key={item.id} className="card" style={{ border: `2px solid ${c.color}15` }}>
                {/* Type Badge */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <div style={{
                    padding: '6px 14px', background: c.bg,
                    borderRadius: '20px', fontSize: '13px',
                    fontWeight: '700', color: c.color,
                    letterSpacing: '0.5px'
                  }}>
                    {item.verification_type} Verification
                  </div>
                  {!isEditing && (
                    <button
                      onClick={() => { setEditing(item.verification_type); setNewPrice(item.price); }}
                      style={{
                        background: 'none', border: 'none', cursor: 'pointer',
                        color: '#6b7280', padding: '6px',
                        borderRadius: '6px', display: 'flex', alignItems: 'center'
                      }}>
                      <FiEdit2 size={16} />
                    </button>
                  )}
                </div>

                {/* Current Price */}
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Current Price
                  </div>
                  <div style={{ fontSize: '40px', fontWeight: '800', color: c.color }}>
                    ₦{parseFloat(item.price).toLocaleString()}
                  </div>
                  <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>per verification</div>
                </div>

                {/* Edit Form */}
                {isEditing ? (
                  <div>
                    <div className="form-group" style={{ marginBottom: '12px' }}>
                      <label className="form-label">New Price (₦)</label>
                      <div style={{ position: 'relative' }}>
                        <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', fontWeight: '600' }}>₦</span>
                        <input
                          className="form-input"
                          style={{ paddingLeft: '30px' }}
                          type="number"
                          value={newPrice}
                          onChange={(e) => setNewPrice(e.target.value)}
                          min={1}
                          autoFocus
                        />
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => handleSave(item.verification_type)}
                        className="btn-primary"
                        disabled={saving}
                        style={{ flex: 1, justifyContent: 'center', gap: '6px', padding: '10px' }}>
                        <FiCheck size={16} /> {saving ? 'Saving...' : 'Save Price'}
                      </button>
                      <button
                        onClick={() => { setEditing(null); setNewPrice(''); }}
                        className="btn-secondary"
                        style={{ padding: '10px 14px' }}>
                        <FiX size={16} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => { setEditing(item.verification_type); setNewPrice(item.price); }}
                    className="btn-secondary"
                    style={{ width: '100%', justifyContent: 'center' }}>
                    <FiEdit2 size={15} /> Edit Price
                  </button>
                )}

                {/* Last updated */}
                <div style={{ fontSize: '11px', color: '#d1d5db', marginTop: '12px', textAlign: 'right' }}>
                  Updated: {new Date(item.updated_at).toLocaleDateString()}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminPricing;