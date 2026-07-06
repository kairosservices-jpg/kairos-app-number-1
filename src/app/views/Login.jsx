import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      navigate('/dashboard');
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError("Please enter an email and password to create an account.");
      return;
    }

    setLoading(true);
    setError(null);

    // Using signup, Supabase will automatically create a row in public.profiles via our SQL trigger
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      alert('Sign up successful! Please check your email to verify if required, or try logging in.');
    }
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>KAIROS MEAL PREPS</h2>
        <p style={styles.subtitle}>System Access</p>
        
        {error && <div style={styles.error}>{error}</div>}
        
        <form onSubmit={handleLogin} style={styles.form}>
          <input 
            type="email" 
            placeholder="Email address" 
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={styles.input}
            required
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={styles.input}
            required
          />
          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
          
          <div style={styles.divider}>or</div>
          
          <button type="button" onClick={handleSignUp} style={styles.secondaryButton} disabled={loading}>
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: 'var(--color-gray-light)',
  },
  card: {
    backgroundColor: 'var(--color-white)',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '400px',
  },
  title: {
    color: 'var(--color-primary)',
    textAlign: 'center',
    marginBottom: '0.5rem',
    letterSpacing: '1px',
    textTransform: 'uppercase',
  },
  subtitle: {
    color: '#666',
    textAlign: 'center',
    marginBottom: '2rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  input: {
    padding: '0.75rem',
    borderRadius: '4px',
    border: '1px solid var(--color-gray-medium)',
    fontSize: '1rem',
  },
  button: {
    backgroundColor: 'var(--color-primary)',
    color: 'white',
    padding: '0.75rem',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    color: 'var(--color-primary)',
    padding: '0.75rem',
    border: '1px solid var(--color-primary)',
    borderRadius: '4px',
    fontSize: '1rem',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  divider: {
    textAlign: 'center',
    color: '#999',
    fontSize: '0.9rem',
    margin: '0.5rem 0',
  },
  error: {
    backgroundColor: '#ffebee',
    color: '#c62828',
    padding: '0.75rem',
    borderRadius: '4px',
    marginBottom: '1rem',
    fontSize: '0.9rem',
  }
};
