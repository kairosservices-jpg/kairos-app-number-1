import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

export default function ClientsList() {
  const { session } = useAuth();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  
  const initialState = {
    name: '',
    email: '',
    phone: '',
    age: '',
    height_ft: '',
    height_in: '',
    weight_lbs: '',
    sex: 'M',
    goal: 'maintain',
    activity_level: '1.2',
    tier: 'L',
    start_date: new Date().toISOString().split('T')[0],
    notes: '',
  };
  
  const [newClient, setNewClient] = useState(initialState);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) console.error('Error fetching clients:', error);
    else setClients(data || []);
    setLoading(false);
  };

  const handleAddClient = async (e) => {
    e.preventDefault();
    
    // Parse numeric fields safely
    const payload = {
      ...newClient,
      age: parseInt(newClient.age) || null,
      height_ft: parseInt(newClient.height_ft) || null,
      height_in: parseInt(newClient.height_in) || null,
      weight_lbs: parseFloat(newClient.weight_lbs) || null,
      activity_level: parseFloat(newClient.activity_level) || 1.2,
      operator_id: session?.user?.id,
      status: 'active'
    };

    const { data, error } = await supabase
      .from('clients')
      .insert([payload])
      .select();

    if (error) {
      alert('Error adding client: ' + error.message);
    } else {
      setClients([data[0], ...clients]);
      setShowAddForm(false);
      setNewClient(initialState);
    }
  };

  return (
    <div>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Clients Overview</h1>
          <p style={styles.subtitle}>Manage your roster and active programs.</p>
        </div>
        <button style={styles.primaryBtn} onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? 'Close Form' : '+ Add New Client'}
        </button>
      </div>

      {showAddForm && (
        <div style={styles.formCard}>
          <div style={styles.formHeader}>
            <h3>Client Onboarding</h3>
            <p>Enter the client's vital statistics and program details.</p>
          </div>
          
          <form onSubmit={handleAddClient} style={styles.form}>
            
            {/* Section: Basic Info */}
            <div style={styles.sectionTitle}>Basic Information</div>
            <div style={styles.grid}>
              <div style={styles.field}>
                <label style={styles.label}>Full Name *</label>
                <input 
                  type="text" 
                  value={newClient.name}
                  onChange={e => setNewClient({...newClient, name: e.target.value})}
                  style={styles.input}
                  required 
                />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Email Address</label>
                <input 
                  type="email" 
                  value={newClient.email}
                  onChange={e => setNewClient({...newClient, email: e.target.value})}
                  style={styles.input}
                />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Phone Number</label>
                <input 
                  type="tel" 
                  value={newClient.phone}
                  onChange={e => setNewClient({...newClient, phone: e.target.value})}
                  style={styles.input}
                />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Start Date</label>
                <input 
                  type="date" 
                  value={newClient.start_date}
                  onChange={e => setNewClient({...newClient, start_date: e.target.value})}
                  style={styles.input}
                />
              </div>
            </div>

            {/* Section: Vitals */}
            <div style={styles.sectionTitle}>Biometrics & Vitals</div>
            <div style={styles.grid3}>
              <div style={styles.field}>
                <label style={styles.label}>Age</label>
                <input 
                  type="number" 
                  value={newClient.age}
                  onChange={e => setNewClient({...newClient, age: e.target.value})}
                  style={styles.input}
                />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Sex</label>
                <select 
                  value={newClient.sex} 
                  onChange={e => setNewClient({...newClient, sex: e.target.value})}
                  style={styles.input}
                >
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                </select>
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Weight (lbs)</label>
                <input 
                  type="number" 
                  step="0.1"
                  value={newClient.weight_lbs}
                  onChange={e => setNewClient({...newClient, weight_lbs: e.target.value})}
                  style={styles.input}
                />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Height (Ft)</label>
                <input 
                  type="number" 
                  value={newClient.height_ft}
                  onChange={e => setNewClient({...newClient, height_ft: e.target.value})}
                  style={styles.input}
                />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Height (In)</label>
                <input 
                  type="number" 
                  value={newClient.height_in}
                  onChange={e => setNewClient({...newClient, height_in: e.target.value})}
                  style={styles.input}
                  max="11"
                />
              </div>
            </div>

            {/* Section: Program Setup */}
            <div style={styles.sectionTitle}>Program Setup</div>
            <div style={styles.grid3}>
              <div style={styles.field}>
                <label style={styles.label}>Goal</label>
                <select 
                  value={newClient.goal} 
                  onChange={e => setNewClient({...newClient, goal: e.target.value})}
                  style={styles.input}
                >
                  <option value="cut">Cut (Fat Loss)</option>
                  <option value="maintain">Maintain</option>
                  <option value="build">Build (Muscle)</option>
                </select>
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Meal Tier</label>
                <select 
                  value={newClient.tier} 
                  onChange={e => setNewClient({...newClient, tier: e.target.value})}
                  style={styles.input}
                >
                  <option value="S">Small (S)</option>
                  <option value="L">Large (L)</option>
                  <option value="XL">Extra Large (XL)</option>
                </select>
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Activity Level</label>
                <select 
                  value={newClient.activity_level} 
                  onChange={e => setNewClient({...newClient, activity_level: e.target.value})}
                  style={styles.input}
                >
                  <option value="1.2">Sedentary (Office job)</option>
                  <option value="1.375">Lightly Active (1-3 days/wk)</option>
                  <option value="1.55">Moderately Active (3-5 days/wk)</option>
                  <option value="1.725">Very Active (6-7 days/wk)</option>
                </select>
              </div>
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Internal Notes / Dietary Restrictions</label>
              <textarea 
                rows="3"
                value={newClient.notes}
                onChange={e => setNewClient({...newClient, notes: e.target.value})}
                style={{...styles.input, resize: 'vertical'}}
                placeholder="Allergies, preferences, specific protocols..."
              ></textarea>
            </div>

            <div style={styles.formFooter}>
              <button type="button" style={styles.cancelBtn} onClick={() => setShowAddForm(false)}>Cancel</button>
              <button type="submit" style={styles.submitBtn}>Save Client Profile</button>
            </div>
          </form>
        </div>
      )}

      <div style={styles.tableCard}>
        {loading ? (
          <div style={styles.emptyState}>Loading clients...</div>
        ) : clients.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>👥</div>
            <p style={styles.emptyText}>No clients found.</p>
            <button style={styles.primaryBtn} onClick={() => setShowAddForm(true)}>Add your first client</button>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Client</th>
                  <th style={styles.th}>Program Details</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Added</th>
                </tr>
              </thead>
              <tbody>
                {clients.map(client => (
                  <tr key={client.id} style={styles.tr}>
                    <td style={styles.td}>
                      <div style={styles.clientName}>{client.name}</div>
                      <div style={styles.subtext}>{client.email || 'No email provided'}</div>
                      <div style={styles.subtext}>{client.phone || ''}</div>
                    </td>
                    <td style={styles.td}>
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '4px' }}>
                        <span style={styles.badgeGoal}>{client.goal}</span>
                        <span style={styles.badgeTier}>Tier {client.tier}</span>
                      </div>
                      <div style={styles.subtext}>
                        {client.sex} • {client.weight_lbs ? `${client.weight_lbs} lbs` : '--'}
                      </div>
                    </td>
                    <td style={styles.td}>
                      <span style={{...styles.statusBadge, ...(client.status === 'active' ? styles.statusActive : {})}}>
                        {client.status}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <div style={styles.subtext}>{new Date(client.created_at).toLocaleDateString()}</div>
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
}

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '2rem',
  },
  title: {
    margin: 0,
    color: '#0f172a',
    fontSize: '2rem',
    fontWeight: '700',
    letterSpacing: '-0.025em',
  },
  subtitle: {
    margin: '0.5rem 0 0 0',
    color: '#64748b',
    fontSize: '1rem',
  },
  primaryBtn: {
    background: '#0f172a',
    color: 'white',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '0.95rem',
    transition: 'background 0.2s',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  },
  cancelBtn: {
    background: 'transparent',
    color: '#64748b',
    border: '1px solid #cbd5e1',
    padding: '0.75rem 1.5rem',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '0.95rem',
  },
  formCard: {
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    marginBottom: '2.5rem',
    border: '1px solid #e2e8f0',
    overflow: 'hidden',
  },
  formHeader: {
    background: '#f8fafc',
    padding: '1.5rem 2rem',
    borderBottom: '1px solid #e2e8f0',
  },
  form: {
    padding: '2rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  sectionTitle: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#334155',
    marginBottom: '-0.5rem',
    paddingBottom: '0.5rem',
    borderBottom: '1px solid #f1f5f9',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '1.5rem',
  },
  grid3: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '1.5rem',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  label: {
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#475569',
  },
  input: {
    padding: '0.75rem 1rem',
    border: '1px solid #cbd5e1',
    borderRadius: '8px',
    fontSize: '0.95rem',
    color: '#0f172a',
    background: '#f8fafc',
    transition: 'all 0.2s',
    outline: 'none',
  },
  formFooter: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '1rem',
    marginTop: '1rem',
    paddingTop: '1.5rem',
    borderTop: '1px solid #e2e8f0',
  },
  submitBtn: {
    background: '#ef4444', // Kairos red
    color: 'white',
    border: 'none',
    padding: '0.75rem 2rem',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '0.95rem',
    boxShadow: '0 4px 6px -1px rgba(239, 68, 68, 0.2)',
  },
  tableCard: {
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    border: '1px solid #e2e8f0',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    background: '#f8fafc',
    padding: '1.25rem 1.5rem',
    textAlign: 'left',
    color: '#475569',
    borderBottom: '1px solid #e2e8f0',
    fontWeight: '600',
    fontSize: '0.875rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  tr: {
    borderBottom: '1px solid #e2e8f0',
    transition: 'background 0.15s',
  },
  td: {
    padding: '1.25rem 1.5rem',
    verticalAlign: 'top',
  },
  clientName: {
    fontWeight: '600',
    color: '#0f172a',
    fontSize: '1.05rem',
    marginBottom: '0.25rem',
  },
  subtext: {
    fontSize: '0.875rem',
    color: '#64748b',
  },
  badgeGoal: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '0.25rem 0.75rem',
    background: '#e0e7ff',
    color: '#4338ca',
    borderRadius: '9999px',
    fontSize: '0.75rem',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  badgeTier: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '0.25rem 0.75rem',
    background: '#fef3c7',
    color: '#b45309',
    borderRadius: '9999px',
    fontSize: '0.75rem',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  statusBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '0.25rem 0.75rem',
    background: '#f1f5f9',
    color: '#475569',
    borderRadius: '9999px',
    fontSize: '0.75rem',
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  statusActive: {
    background: '#dcfce7',
    color: '#166534',
  },
  emptyState: {
    padding: '4rem 2rem',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyIcon: {
    fontSize: '3rem',
    marginBottom: '1rem',
    opacity: 0.5,
  },
  emptyText: {
    color: '#64748b',
    fontSize: '1.1rem',
    marginBottom: '1.5rem',
  }
};
