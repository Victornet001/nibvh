import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiShield, FiCheckCircle, FiUsers, FiFileText, FiMenu, FiX, FiArrowRight } from 'react-icons/fi';

const LandingPage = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', color: '#0f0f0d' }}>

      {/* Navbar */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        background: 'white', borderBottom: '1px solid #e5e7eb',
        padding: '0 24px', height: '64px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '36px', height: '36px', background: '#0f5132',
            borderRadius: '8px', display: 'flex', alignItems: 'center',
            justifyContent: 'center'
          }}>
            <FiShield color="white" size={18} />
          </div>
          <span style={{ fontWeight: '800', fontSize: '18px', color: '#0f5132' }}>NIBVH</span>
        </div>

        {/* Desktop Nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}
          className="hide-mobile">
          <a href="#features" style={{ color: '#6b7280', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>Features</a>
          <a href="#pricing" style={{ color: '#6b7280', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>Pricing</a>
          <a href="#about" style={{ color: '#6b7280', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>About</a>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button className="btn-secondary hide-mobile"
            onClick={() => navigate('/login')}
            style={{ padding: '8px 20px' }}>
            Login
          </button>
          <button className="btn-primary"
            onClick={() => navigate('/register')}
            style={{ padding: '8px 20px' }}>
            Get Started
          </button>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'none' }}
            className="show-mobile">
            {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={{
          position: 'fixed', top: '64px', left: 0, right: 0, zIndex: 999,
          background: 'white', padding: '20px 24px',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex', flexDirection: 'column', gap: '16px'
        }}>
          <a href="#features" style={{ color: '#374151', textDecoration: 'none', fontSize: '15px', fontWeight: '500' }}>Features</a>
          <a href="#pricing" style={{ color: '#374151', textDecoration: 'none', fontSize: '15px', fontWeight: '500' }}>Pricing</a>
          <a href="#about" style={{ color: '#374151', textDecoration: 'none', fontSize: '15px', fontWeight: '500' }}>About</a>
          <button className="btn-secondary" onClick={() => navigate('/login')}>Login</button>
          <button className="btn-primary" onClick={() => navigate('/register')}>Get Started</button>
        </div>
      )}

      {/* Hero Section */}
      <section style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f5132 0%, #1a7a55 50%, #0f5132 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '100px 24px 60px', textAlign: 'center'
      }}>
        <div style={{ maxWidth: '800px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgba(255,255,255,0.15)', borderRadius: '20px',
            padding: '6px 16px', marginBottom: '24px'
          }}>
            <FiCheckCircle color="white" size={14} />
            <span style={{ color: 'white', fontSize: '13px', fontWeight: '500' }}>
              Licensed KYC Verification Platform
            </span>
          </div>

          <h1 style={{
            fontSize: 'clamp(36px, 6vw, 64px)',
            fontWeight: '800', color: 'white',
            lineHeight: '1.15', marginBottom: '24px',
            letterSpacing: '-1px'
          }}>
            Nigeria's Most Trusted<br />
            <span style={{ color: '#86efac' }}>Identity Verification</span> Hub
          </h1>

          <p style={{
            fontSize: 'clamp(16px, 2vw, 20px)',
            color: 'rgba(255,255,255,0.85)',
            lineHeight: '1.7', marginBottom: '40px',
            maxWidth: '600px', margin: '0 auto 40px'
          }}>
            Verify BVN, NIN, and CAC records instantly using licensed KYC providers.
            Generate professional compliance reports in seconds.
          </p>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn-primary"
              onClick={() => navigate('/register')}
              style={{
                background: 'white', color: '#0f5132',
                padding: '14px 32px', fontSize: '16px',
                borderRadius: '10px'
              }}>
              Start Verifying Free <FiArrowRight style={{ marginLeft: '4px' }} />
            </button>
            <button className="btn-secondary"
              onClick={() => navigate('/login')}
              style={{
                background: 'transparent', color: 'white',
                borderColor: 'white', padding: '14px 32px',
                fontSize: '16px', borderRadius: '10px'
              }}>
              Login to Dashboard
            </button>
          </div>

          {/* Stats */}
          <div style={{
            display: 'flex', gap: '40px', justifyContent: 'center',
            marginTop: '60px', flexWrap: 'wrap'
          }}>
            {[
              { value: '50,000+', label: 'Verifications Done' },
              { value: '99.9%', label: 'Uptime' },
              { value: '< 3s', label: 'Response Time' },
              { value: 'NDPR', label: 'Compliant' },
            ].map((stat, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '28px', fontWeight: '800', color: 'white' }}>{stat.value}</div>
                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', marginTop: '4px' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" style={{ padding: '80px 24px', background: 'white' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ fontSize: '36px', fontWeight: '800', color: '#0f5132', marginBottom: '16px' }}>
              Everything You Need
            </h2>
            <p style={{ fontSize: '18px', color: '#6b7280', maxWidth: '500px', margin: '0 auto' }}>
              One platform for all your Nigerian identity and business verification needs
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px'
          }}>
            {[
              {
                icon: <FiShield size={28} color="#0f5132" />,
                title: 'BVN Verification',
                desc: 'Instantly verify Bank Verification Numbers and get full name, date of birth, and bank-linked status.',
                color: '#e8f7f1'
              },
              {
                icon: <FiUsers size={28} color="#1d4ed8" />,
                title: 'NIN Verification',
                desc: 'Verify National Identity Numbers with photo, gender, and full personal details from NIMC.',
                color: '#eff6ff'
              },
              {
                icon: <FiCheckCircle size={28} color="#d97706" />,
                title: 'CAC Verification',
                desc: 'Search and verify registered businesses, directors, and company status from CAC records.',
                color: '#fffbeb'
              },
              {
                icon: <FiFileText size={28} color="#7c3aed" />,
                title: 'PDF Reports',
                desc: 'Generate professional compliance reports in Standard, ID Card, or Detailed format instantly.',
                color: '#f5f3ff'
              },
            ].map((feature, i) => (
              <div key={i} className="card" style={{ padding: '32px' }}>
                <div style={{
                  width: '56px', height: '56px',
                  background: feature.color,
                  borderRadius: '12px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: '20px'
                }}>
                  {feature.icon}
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '12px' }}>{feature.title}</h3>
                <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.7' }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" style={{ padding: '80px 24px', background: '#f8faf9' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ fontSize: '36px', fontWeight: '800', color: '#0f5132', marginBottom: '16px' }}>
              Simple, Transparent Pricing
            </h2>
            <p style={{ fontSize: '18px', color: '#6b7280' }}>
              Pay only for what you use. No hidden fees.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '24px'
          }}>
            {[
              { type: 'BVN Verification', price: '₦500', desc: 'Per lookup', color: '#0f5132' },
              { type: 'NIN Verification', price: '₦500', desc: 'Per lookup', color: '#1d4ed8' },
              { type: 'CAC Verification', price: '₦500', desc: 'Per lookup', color: '#d97706' },
            ].map((plan, i) => (
              <div key={i} className="card" style={{
                textAlign: 'center', padding: '40px 24px',
                border: `2px solid ${plan.color}20`
              }}>
                <div style={{
                  fontSize: '14px', fontWeight: '600',
                  color: plan.color, marginBottom: '16px',
                  textTransform: 'uppercase', letterSpacing: '0.5px'
                }}>
                  {plan.type}
                </div>
                <div style={{ fontSize: '48px', fontWeight: '800', color: '#0f0f0d', marginBottom: '8px' }}>
                  {plan.price}
                </div>
                <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '24px' }}>{plan.desc}</div>
                <button className="btn-primary"
                  onClick={() => navigate('/register')}
                  style={{ width: '100%', justifyContent: 'center', background: plan.color }}>
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        background: '#0f5132', color: 'white',
        padding: '40px 24px', textAlign: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', marginBottom: '16px' }}>
          <div style={{
            width: '32px', height: '32px', background: 'rgba(255,255,255,0.2)',
            borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <FiShield color="white" size={16} />
          </div>
          <span style={{ fontWeight: '800', fontSize: '16px' }}>NIBVH</span>
        </div>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', marginBottom: '8px' }}>
          Nigeria Identity & Business Verification Hub
        </p>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>
          © 2026 NIBVH. All rights reserved. NDPR Compliant.
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;