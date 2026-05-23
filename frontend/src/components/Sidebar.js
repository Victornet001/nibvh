import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  FiHome, FiShield, FiUsers, FiFileText,
  FiClock, FiDollarSign, FiUser, FiLogOut,
  FiMenu, FiX, FiSettings, FiChevronLeft, FiChevronRight
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Sidebar = ({ collapsed, setCollapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logoutUser } = useAuth();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const userLinks = [
    { path: '/dashboard', icon: <FiHome size={18} />, label: 'Dashboard' },
    { path: '/dashboard/bvn', icon: <FiShield size={18} />, label: 'BVN Verify' },
    { path: '/dashboard/nin', icon: <FiUsers size={18} />, label: 'NIN Verify' },
    { path: '/dashboard/cac', icon: <FiFileText size={18} />, label: 'CAC Verify' },
    { path: '/dashboard/history', icon: <FiClock size={18} />, label: 'History' },
    { path: '/dashboard/wallet', icon: <FiDollarSign size={18} />, label: 'Wallet' },
    { path: '/dashboard/profile', icon: <FiUser size={18} />, label: 'Profile' },
    { path: '/dashboard/settings', icon: <FiSettings size={18} />, label: 'API Settings' },
  ];

  const adminLinks = [
    { path: '/admin', icon: <FiHome size={18} />, label: 'Admin Home' },
    { path: '/admin/users', icon: <FiUsers size={18} />, label: 'Users' },
    { path: '/admin/pricing', icon: <FiSettings size={18} />, label: 'Pricing' },
  ];

  const links = user?.role === 'admin' ? adminLinks : userLinks;

  const handleLogout = () => {
    logoutUser();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const handleNavigate = (path) => {
    navigate(path);
    setMobileOpen(false);
  };

  // ─── Shared Nav Links ───────────────────────────────
  const NavLinks = ({ isMobile = false }) => (
    <nav style={{ flex: 1, padding: (!isMobile && collapsed) ? '16px 8px' : '16px 12px', overflowY: 'auto' }}>
      {(!collapsed || isMobile) && (
        <div style={{
          fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.8px',
          color: '#9ca3af', fontWeight: '500', padding: '0 12px', marginBottom: '8px'
        }}>
          {user?.role === 'admin' ? 'Admin Panel' : 'Main Menu'}
        </div>
      )}
      {links.map((link) => {
        const isActive = location.pathname === link.path;
        return (
          <button
            key={link.path}
            onClick={() => handleNavigate(link.path)}
            title={(!isMobile && collapsed) ? link.label : ''}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: (!isMobile && collapsed) ? '12px' : '10px 12px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              background: isActive ? '#e8f7f1' : 'transparent',
              color: isActive ? '#0f5132' : '#6b7280',
              fontWeight: isActive ? '600' : '400',
              fontSize: isMobile ? '15px' : '14px',
              fontFamily: 'Inter, sans-serif',
              marginBottom: '2px',
              transition: 'background 0.15s',
              justifyContent: (!isMobile && collapsed) ? 'center' : 'flex-start',
              textAlign: 'left'
            }}
          >
            <span style={{ color: isActive ? '#0f5132' : '#9ca3af', flexShrink: 0 }}>
              {link.icon}
            </span>
            {(isMobile || !collapsed) && link.label}
            {(isMobile || !collapsed) && isActive && (
              <span style={{
                marginLeft: 'auto', width: '6px', height: '6px',
                background: '#0f5132', borderRadius: '50%', flexShrink: 0
              }} />
            )}
          </button>
        );
      })}
    </nav>
  );

  // ─── Shared Logout ───────────────────────────────────
  const LogoutBtn = ({ isMobile = false }) => (
    <div style={{
      padding: (!isMobile && collapsed) ? '16px 8px' : '16px 12px',
      borderTop: '1px solid #e5e7eb'
    }}>
      <button
        onClick={handleLogout}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: (!isMobile && collapsed) ? '12px' : '10px 12px',
          borderRadius: '8px',
          border: 'none',
          cursor: 'pointer',
          background: '#fef2f2',
          color: '#dc2626',
          fontSize: isMobile ? '15px' : '14px',
          fontFamily: 'Inter, sans-serif',
          fontWeight: '500',
          justifyContent: (!isMobile && collapsed) ? 'center' : 'flex-start'
        }}>
        <FiLogOut size={18} />
        {(isMobile || !collapsed) && 'Logout'}
      </button>
    </div>
  );

  return (
    <>
      {/* ══════════════ DESKTOP SIDEBAR ══════════════ */}
      <div
        className="desktop-sidebar"
        style={{
          width: collapsed ? '64px' : '240px',
          height: '100vh',
          position: 'fixed',
          left: 0, top: 0,
          transition: 'width 0.2s ease',
          zIndex: 100,
          background: 'white',
          borderRight: '1px solid #e5e7eb',
          boxShadow: '2px 0 8px rgba(0,0,0,0.04)',
          flexDirection: 'column'
        }}>

        {/* Logo row */}
        <div style={{
          padding: collapsed ? '18px 0' : '18px 20px',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
          minHeight: '64px'
        }}>
          {/* Logo mark always visible */}
          <div style={{
            width: '34px', height: '34px', background: '#0f5132',
            borderRadius: '8px', display: 'flex', alignItems: 'center',
            justifyContent: 'center', flexShrink: 0
          }}>
            <FiShield color="white" size={16} />
          </div>

          {/* Brand name — hidden when collapsed */}
          {!collapsed && (
            <span style={{
              fontWeight: '800', fontSize: '16px', color: '#0f5132',
              flex: 1, marginLeft: '10px'
            }}>
              NIBVH
            </span>
          )}

          {/* Collapse toggle */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#9ca3af', padding: '4px', borderRadius: '6px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginLeft: collapsed ? '0' : '4px', flexShrink: 0
            }}>
            {collapsed ? <FiChevronRight size={16} /> : <FiChevronLeft size={16} />}
          </button>
        </div>

        {/* User info — hidden when collapsed */}
        {!collapsed && (
          <div style={{
            padding: '14px 20px',
            borderBottom: '1px solid #e5e7eb',
            background: '#f8faf9'
          }}>
            <div style={{
              width: '34px', height: '34px', background: '#0f5132',
              borderRadius: '50%', display: 'flex', alignItems: 'center',
              justifyContent: 'center', marginBottom: '8px'
            }}>
              <span style={{ color: 'white', fontWeight: '700', fontSize: '13px' }}>
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div style={{ fontSize: '13px', fontWeight: '600', color: '#0f0f0d', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.name}
            </div>
            <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '1px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.email}
            </div>
            <span className={`badge ${user?.role === 'admin' ? 'badge-amber' : 'badge-green'}`}
              style={{ marginTop: '6px', fontSize: '10px' }}>
              {user?.role}
            </span>
          </div>
        )}

        <NavLinks />
        <LogoutBtn />
      </div>

      {/* ══════════════ MOBILE TOP BAR ══════════════ */}
      <div
        className="mobile-topbar"
        style={{
          position: 'fixed', top: 0, left: 0, right: 0,
          height: '56px', background: 'white',
          borderBottom: '1px solid #e5e7eb',
          zIndex: 200,
          alignItems: 'center',
          padding: '0 16px',
          justifyContent: 'space-between',
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
        }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '30px', height: '30px', background: '#0f5132',
            borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <FiShield color="white" size={14} />
          </div>
          <span style={{ fontWeight: '800', fontSize: '15px', color: '#0f5132' }}>NIBVH</span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#0f5132', padding: '6px', borderRadius: '6px',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
          {mobileOpen ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>
      </div>

      {/* ══════════════ MOBILE DRAWER ══════════════ */}
      {mobileOpen && (
        <>
          {/* Dark overlay */}
          <div
            onClick={() => setMobileOpen(false)}
            style={{
              position: 'fixed', inset: 0,
              background: 'rgba(0,0,0,0.45)',
              zIndex: 198, top: '56px'
            }}
          />
          {/* Slide-in drawer */}
          <div style={{
            position: 'fixed',
            top: '56px', left: 0,
            width: '260px', bottom: 0,
            background: 'white',
            zIndex: 199,
            display: 'flex', flexDirection: 'column',
            borderRight: '1px solid #e5e7eb',
            boxShadow: '4px 0 16px rgba(0,0,0,0.1)',
            overflowY: 'auto'
          }}>
            {/* User info in drawer */}
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid #e5e7eb',
              background: '#f8faf9'
            }}>
              <div style={{
                width: '40px', height: '40px', background: '#0f5132',
                borderRadius: '50%', display: 'flex', alignItems: 'center',
                justifyContent: 'center', marginBottom: '8px'
              }}>
                <span style={{ color: 'white', fontWeight: '700', fontSize: '16px' }}>
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#0f0f0d' }}>{user?.name}</div>
              <div style={{ fontSize: '12px', color: '#9ca3af' }}>{user?.email}</div>
              <span className={`badge ${user?.role === 'admin' ? 'badge-amber' : 'badge-green'}`}
                style={{ marginTop: '6px', fontSize: '11px' }}>
                {user?.role}
              </span>
            </div>

            <NavLinks isMobile={true} />
            <LogoutBtn isMobile={true} />
          </div>
        </>
      )}
    </>
  );
};

export default Sidebar;