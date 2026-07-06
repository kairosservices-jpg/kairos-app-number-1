import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Outlet } from 'react-router-dom';

export default function OperatorLayout({ children }) {
  const { signOut, profile } = useAuth();
  const navigate = useNavigate();

  return (
    <div style={styles.layout}>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <h2 style={styles.brand}>KAIROS</h2>
          <span style={styles.badge}>OPERATOR</span>
        </div>
        
        <nav style={styles.nav}>
          <button style={styles.navItemActive} onClick={() => navigate('/dashboard')}>
            Clients
          </button>
          <button style={styles.navItem} onClick={() => alert('Plans coming soon')}>
            Weekly Plans
          </button>
          <button style={styles.navItem} onClick={() => alert('Meals coming soon')}>
            Meal Database
          </button>
        </nav>

        <div style={styles.sidebarFooter}>
          <div style={styles.userInfo}>
            <span style={styles.userEmail}>{profile?.email}</span>
          </div>
          <button style={styles.signOutBtn} onClick={signOut}>Sign Out</button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={styles.main}>
        {children || <Outlet />}
      </main>
    </div>
  );
}

const styles = {
  layout: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#f5f7fa',
  },
  sidebar: {
    width: '250px',
    backgroundColor: '#1a1f2c',
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
  },
  sidebarHeader: {
    padding: '2rem 1.5rem',
    borderBottom: '1px solid #2d3748',
  },
  brand: {
    margin: 0,
    fontSize: '1.5rem',
    color: '#fff',
    letterSpacing: '2px',
  },
  badge: {
    display: 'inline-block',
    marginTop: '0.5rem',
    padding: '0.25rem 0.5rem',
    backgroundColor: 'var(--color-primary)',
    color: 'white',
    fontSize: '0.75rem',
    fontWeight: 'bold',
    borderRadius: '4px',
  },
  nav: {
    flex: 1,
    padding: '1.5rem 0',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  navItem: {
    padding: '0.75rem 1.5rem',
    background: 'transparent',
    border: 'none',
    color: '#a0aec0',
    textAlign: 'left',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  navItemActive: {
    padding: '0.75rem 1.5rem',
    background: 'rgba(255,255,255,0.1)',
    border: 'none',
    color: '#fff',
    textAlign: 'left',
    fontSize: '1rem',
    cursor: 'pointer',
    borderLeft: '4px solid var(--color-primary)',
  },
  sidebarFooter: {
    padding: '1.5rem',
    borderTop: '1px solid #2d3748',
  },
  userInfo: {
    marginBottom: '1rem',
    fontSize: '0.85rem',
    color: '#a0aec0',
    wordBreak: 'break-all',
  },
  signOutBtn: {
    width: '100%',
    padding: '0.5rem',
    background: 'transparent',
    border: '1px solid #4a5568',
    color: '#cbd5e0',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  main: {
    flex: 1,
    overflowY: 'auto',
    padding: '2rem',
  }
};
