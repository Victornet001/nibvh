import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiShield, FiMail, FiLock, FiUser, FiEye, FiEyeOff } from 'react-icons/fi';
import { register } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const Register = () => {
  const navigate = useNavigate();
  const { loginUser } = useAuth();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agreed) {
      toast.error('Please agree to the terms and conditions');
      return;
    }
    setLoading(true);
    try {
      const res = await register(formData);
      loginUser(res.data.token, res.data.user);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f5132 0%, #1a7a55 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px'
    }}>
      <div style={{ width: '100%', maxWidth: '440px' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '56px', height: '56px', background: 'white',
            borderRadius: '14px', display: 'flex', alignItems: 'center',
            justifyContent: 'center', margin: '0 auto 16px',
            boxShadow: '0 4px 14px rgba(0,0,0,0.15)'
          }}>
            <FiShield size={28} color="#0f5132" />
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: '800', color: 'white' }}>Create Account</h1>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '14px', marginTop: '6px' }}>
            Start verifying identities in minutes
          </p>
        </div>

        {/* Card */}
        <div className="card" style={{ padding: '32px' }}>
          <form onSubmit={handleSubmit}>

            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div style={{ position: 'relative' }}>
                <FiUser style={{
                  position: 'absolute', left: '14px',
                  top: '50%', transform: 'translateY(-50%)',
                  color: '#9ca3af'
                }} />
                <input
                  className="form-input"
                  style={{ paddingLeft: '40px' }}
                  type="text"
                  name="name"
                  placeholder="Your full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <FiMail style={{
                  position: 'absolute', left: '14px',
                  top: '50%', transform: 'translateY(-50%)',
                  color: '#9ca3af'
                }} />
                <input
                  className="form-input"
                  style={{ paddingLeft: '40px' }}
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <FiLock style={{
                  position: 'absolute', left: '14px',
                  top: '50%', transform: 'translateY(-50%)',
                  color: '#9ca3af'
                }} />
                <input
                  className="form-input"
                  style={{ paddingLeft: '40px', paddingRight: '40px' }}
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Minimum 6 characters"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute', right: '14px',
                    top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none',
                    cursor: 'pointer', color: '#9ca3af'
                  }}>
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            {/* Consent Toggle */}
            <div style={{
              display: 'flex', alignItems: 'flex-start', gap: '12px',
              marginBottom: '24px', padding: '14px',
              background: '#f8faf9', borderRadius: '8px',
              border: '1px solid #e5e7eb'
            }}>
              <label className="toggle" style={{ flexShrink: 0, marginTop: '2px' }}>
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
              <span style={{ fontSize: '13px', color: '#6b7280', lineHeight: '1.6' }}>
                I agree to the <span style={{ color: '#0f5132', fontWeight: '600' }}>Terms of Service</span> and{' '}
                <span style={{ color: '#0f5132', fontWeight: '600' }}>Privacy Policy</span>.
                I confirm compliance with NDPR data protection guidelines.
              </span>
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
              style={{ width: '100%', justifyContent: 'center', padding: '13px', fontSize: '15px' }}>
              {loading ? 'Creating Account...' : 'Create Free Account'}
            </button>

          </form>

          <div style={{
            textAlign: 'center', marginTop: '24px',
            fontSize: '14px', color: '#6b7280'
          }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#0f5132', fontWeight: '600', textDecoration: 'none' }}>
              Sign in
            </Link>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Link to="/" style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', textDecoration: 'none' }}>
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;