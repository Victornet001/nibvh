import React, { useState, useEffect } from 'react';
import { FiDollarSign, FiArrowUpCircle, FiArrowDownCircle, FiPlus } from 'react-icons/fi';
import { getWallet, getTransactions, fundWallet } from '../../utils/api';
import toast from 'react-hot-toast';

const Wallet = () => {
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState('');
  const [funding, setFunding] = useState(false);
  const [showFundModal, setShowFundModal] = useState(false);

  useEffect(() => {
    Promise.all([getWallet(), getTransactions()])
      .then(([walletRes, transRes]) => {
        setWallet(walletRes.data.wallet);
        setTransactions(transRes.data.transactions || []);
      })
      .catch(() => toast.error('Could not load wallet'))
      .finally(() => setLoading(false));
  }, []);

  const handleFund = async (e) => {
    e.preventDefault();
    if (!amount || amount < 100) {
      toast.error('Minimum amount is ₦100');
      return;
    }
    setFunding(true);
    try {
      const res = await fundWallet({ amount: parseInt(amount) });
      toast.success('Redirecting to payment...');
      window.open(res.data.paymentUrl, '_blank');
      setShowFundModal(false);
      setAmount('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Payment failed');
    } finally {
      setFunding(false);
    }
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
      <div className="spinner"></div>
    </div>
  );

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div style={{ width: '44px', height: '44px', background: '#e8f7f1', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FiDollarSign size={22} color="#0f5132" />
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#0f0f0d' }}>My Wallet</h1>
        </div>
        <p style={{ color: '#6b7280', fontSize: '15px', marginLeft: '56px' }}>
          Manage your verification credits
        </p>
      </div>

      {/* Balance Card */}
      <div style={{
        background: 'linear-gradient(135deg, #0f5132 0%, #1a7a55 100%)',
        borderRadius: '16px', padding: '32px',
        marginBottom: '24px', color: 'white',
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px'
      }}>
        <div>
          <div style={{ fontSize: '14px', opacity: 0.8, marginBottom: '8px' }}>Available Balance</div>
          <div style={{ fontSize: '42px', fontWeight: '800', letterSpacing: '-1px' }}>
            ₦{parseFloat(wallet?.balance || 0).toLocaleString('en-NG', { minimumFractionDigits: 2 })}
          </div>
          <div style={{ fontSize: '13px', opacity: 0.7, marginTop: '8px' }}>
            {transactions.length} total transactions
          </div>
        </div>
        <button
          onClick={() => setShowFundModal(true)}
          style={{
            background: 'white', color: '#0f5132',
            border: 'none', padding: '14px 28px',
            borderRadius: '10px', fontWeight: '700',
            fontSize: '15px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '8px',
            fontFamily: 'Inter, sans-serif',
            boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
            transition: 'all 0.2s'
          }}>
          <FiPlus size={18} /> Fund Wallet
        </button>
      </div>

      {/* Pricing Info */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
        gap: '12px', marginBottom: '24px'
      }}>
        {[
          { label: 'BVN Check', price: '₦100', color: '#1d4ed8', bg: '#eff6ff' },
          { label: 'NIN Check', price: '₦100', color: '#d97706', bg: '#fffbeb' },
          { label: 'CAC Check', price: '₦200', color: '#0f5132', bg: '#e8f7f1' },
        ].map((item, i) => (
          <div key={i} className="card" style={{ textAlign: 'center', padding: '20px', border: `1.5px solid ${item.color}20` }}>
            <div style={{ fontSize: '22px', fontWeight: '800', color: item.color }}>{item.price}</div>
            <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px' }}>per {item.label}</div>
          </div>
        ))}
      </div>

      {/* Transactions */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #e5e7eb' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#0f0f0d' }}>Transaction History</h2>
        </div>

        {transactions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 24px', color: '#9ca3af' }}>
            <FiDollarSign size={48} style={{ marginBottom: '16px', opacity: 0.4 }} />
            <p style={{ fontSize: '16px', fontWeight: '600' }}>No transactions yet</p>
            <p style={{ fontSize: '13px', marginTop: '6px' }}>Fund your wallet to get started</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Amount</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx.id}>
                    <td style={{ fontSize: '14px' }}>{tx.description}</td>
                    <td style={{ fontWeight: '600' }}>
                      <span style={{ color: tx.type === 'credit' ? '#0f5132' : '#dc2626' }}>
                        {tx.type === 'credit' ? '+' : '-'}₦{parseFloat(tx.amount).toLocaleString()}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {tx.type === 'credit'
                          ? <FiArrowUpCircle size={16} color="#0f5132" />
                          : <FiArrowDownCircle size={16} color="#dc2626" />
                        }
                        <span className={`badge ${tx.type === 'credit' ? 'badge-green' : 'badge-red'}`}>
                          {tx.type}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${tx.status === 'completed' ? 'badge-green' : 'badge-amber'}`}>
                        {tx.status}
                      </span>
                    </td>
                    <td style={{ fontSize: '13px', color: '#6b7280' }}>
                      {new Date(tx.created_at).toLocaleDateString('en-NG', {
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

      {/* Fund Modal */}
      {showFundModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, padding: '24px'
        }}>
          <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '32px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '6px' }}>Fund Your Wallet</h2>
            <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '24px' }}>
              Powered by Paystack. Secure and instant.
            </p>

            <form onSubmit={handleFund}>
              <div className="form-group">
                <label className="form-label">Amount (₦)</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', fontWeight: '600' }}>₦</span>
                  <input
                    className="form-input"
                    style={{ paddingLeft: '30px' }}
                    type="number"
                    placeholder="Enter amount (min ₦100)"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    min={100}
                    required
                  />
                </div>
              </div>

              {/* Quick amounts */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
                {[500, 1000, 2000, 5000].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setAmount(val)}
                    style={{
                      padding: '7px 14px', borderRadius: '8px',
                      border: `1.5px solid ${amount == val ? '#0f5132' : '#e5e7eb'}`,
                      background: amount == val ? '#e8f7f1' : 'white',
                      color: amount == val ? '#0f5132' : '#6b7280',
                      fontWeight: '500', fontSize: '13px',
                      cursor: 'pointer', fontFamily: 'Inter, sans-serif'
                    }}>
                    ₦{val.toLocaleString()}
                  </button>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => setShowFundModal(false)}
                  className="btn-secondary"
                  style={{ flex: 1, justifyContent: 'center' }}>
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={funding}
                  style={{ flex: 1, justifyContent: 'center' }}>
                  {funding ? 'Processing...' : 'Pay with Paystack'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Wallet;