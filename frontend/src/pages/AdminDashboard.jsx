import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

const STAGES = ['PLANTED', 'GROWING', 'READY', 'HARVESTED'];

const stageBadge = (stage) => {
  const colors = {
    PLANTED: { bg: '#E8F5E9', color: '#2E7D32' },
    GROWING: { bg: '#F1F8E9', color: '#558B2F' },
    READY: { bg: '#FFF8E1', color: '#F57C00' },
    HARVESTED: { bg: '#E0F2F1', color: '#00695C' },
  };
  const s = colors[stage] || { bg: '#eee', color: '#333' };
  return (
    <span style={{ background: s.bg, color: s.color, borderRadius: '20px', padding: '3px 12px', fontSize: '12px', fontWeight: '600' }}>
      {stage}
    </span>
  );
};

const statusBadge = (status) => {
  const colors = {
    Active: { bg: '#E8F5E9', color: '#2E7D32' },
    'At Risk': { bg: '#FFF3E0', color: '#E65100' },
    Completed: { bg: '#F3E5F5', color: '#6A1B9A' },
  };
  const s = colors[status] || { bg: '#eee', color: '#333' };
  return (
    <span style={{ background: s.bg, color: s.color, borderRadius: '20px', padding: '3px 12px', fontSize: '12px', fontWeight: '600' }}>
      {status}
    </span>
  );
};

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [fields, setFields] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', cropType: '', plantingDate: '', agentId: '' });
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      const [fieldsRes, agentsRes] = await Promise.all([
        API.get('/fields'),
        API.get('/fields/agents'),
      ]);
      setFields(fieldsRes.data);
      setAgents(agentsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await API.post('/fields', form);
      setShowModal(false);
      setForm({ name: '', cropType: '', plantingDate: '', agentId: '' });
      fetchData();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const total = fields.length;
  const active = fields.filter(f => f.status === 'Active').length;
  const atRisk = fields.filter(f => f.status === 'At Risk').length;
  const completed = fields.filter(f => f.status === 'Completed').length;

  return (
    <div style={{ minHeight: '100vh', background: '#F1F8E9', fontFamily: 'sans-serif' }}>
      {/* Navbar */}
      <div style={{ background: '#1B5E20', padding: '0 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#F57C00', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>🌿</div>
          <div>
            <div style={{ color: 'white', fontWeight: '700', fontSize: '16px', lineHeight: 1 }}>Shamba Records</div>
            <div style={{ color: '#A5D6A7', fontSize: '11px' }}>SmartSeason</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ color: '#C8E6C9', fontSize: '14px' }}>👤 {user?.name}</span>
          <button onClick={logout} style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '8px', padding: '6px 16px', cursor: 'pointer', fontSize: '13px' }}>
            Logout
          </button>
        </div>
      </div>

      <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h1 style={{ color: '#1B5E20', fontSize: '24px', fontWeight: '700', margin: 0 }}>Admin Dashboard</h1>
            <p style={{ color: '#558B2F', fontSize: '14px', margin: '4px 0 0' }}>Overview of all fields and agents</p>
          </div>
          <button onClick={() => setShowModal(true)} style={{ background: '#F57C00', color: 'white', border: 'none', borderRadius: '10px', padding: '10px 20px', fontWeight: '600', fontSize: '14px', cursor: 'pointer' }}>
            + New Field
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
          {[
            { label: 'Total Fields', value: total, color: '#1B5E20', bg: 'white' },
            { label: 'Active', value: active, color: '#2E7D32', bg: '#E8F5E9' },
            { label: 'At Risk', value: atRisk, color: '#E65100', bg: '#FFF3E0' },
            { label: 'Completed', value: completed, color: '#6A1B9A', bg: '#F3E5F5' },
          ].map((stat) => (
            <div key={stat.label} style={{ background: stat.bg, borderRadius: '14px', padding: '1.25rem', border: '1px solid rgba(0,0,0,0.06)' }}>
              <div style={{ color: '#888', fontSize: '13px', marginBottom: '6px' }}>{stat.label}</div>
              <div style={{ color: stat.color, fontSize: '32px', fontWeight: '700' }}>{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Fields Table */}
        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.06)', overflow: 'hidden' }}>
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #E8F5E9' }}>
            <h2 style={{ margin: 0, color: '#1B5E20', fontSize: '16px', fontWeight: '600' }}>All Fields</h2>
          </div>
          {loading ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#888' }}>Loading fields...</div>
          ) : fields.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#888' }}>No fields yet. Create one!</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#F9FBF9' }}>
                  {['Field Name', 'Crop', 'Agent', 'Planted', 'Stage', 'Status'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', color: '#888', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {fields.map((field, i) => (
                  <tr key={field.id} style={{ borderTop: '1px solid #F1F8E9', background: i % 2 === 0 ? 'white' : '#FAFFFE' }}>
                    <td style={{ padding: '14px 16px', fontWeight: '600', color: '#1B5E20', fontSize: '14px' }}>{field.name}</td>
                    <td style={{ padding: '14px 16px', color: '#555', fontSize: '14px' }}>{field.cropType}</td>
                    <td style={{ padding: '14px 16px', color: '#555', fontSize: '14px' }}>{field.agent?.name}</td>
                    <td style={{ padding: '14px 16px', color: '#555', fontSize: '14px' }}>{new Date(field.plantingDate).toLocaleDateString()}</td>
                    <td style={{ padding: '14px 16px' }}>{stageBadge(field.stage)}</td>
                    <td style={{ padding: '14px 16px' }}>{statusBadge(field.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Create Field Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div style={{ background: 'white', borderRadius: '20px', padding: '2rem', width: '100%', maxWidth: '460px', margin: '1rem' }}>
            <h2 style={{ color: '#1B5E20', margin: '0 0 1.5rem', fontSize: '18px' }}>Create New Field</h2>
            <form onSubmit={handleCreate}>
              {[
                { label: 'Field Name', key: 'name', type: 'text', placeholder: 'e.g. North Field A' },
                { label: 'Crop Type', key: 'cropType', type: 'text', placeholder: 'e.g. Maize' },
                { label: 'Planting Date', key: 'plantingDate', type: 'date', placeholder: '' },
              ].map(({ label, key, type, placeholder }) => (
                <div key={key} style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#444', marginBottom: '5px' }}>{label}</label>
                  <input type={type} placeholder={placeholder} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} required
                    style={{ width: '100%', boxSizing: 'border-box', border: '1px solid #ddd', borderRadius: '8px', padding: '10px 12px', fontSize: '14px', outline: 'none' }} />
                </div>
              ))}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#444', marginBottom: '5px' }}>Assign Agent</label>
                <select value={form.agentId} onChange={(e) => setForm({ ...form, agentId: e.target.value })} required
                  style={{ width: '100%', border: '1px solid #ddd', borderRadius: '8px', padding: '10px 12px', fontSize: '14px', outline: 'none' }}>
                  <option value="">Select an agent</option>
                  {agents.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="button" onClick={() => setShowModal(false)}
                  style={{ flex: 1, padding: '10px', border: '1px solid #ddd', borderRadius: '8px', background: 'white', cursor: 'pointer', fontSize: '14px' }}>
                  Cancel
                </button>
                <button type="submit" disabled={submitting}
                  style={{ flex: 1, padding: '10px', border: 'none', borderRadius: '8px', background: '#1B5E20', color: 'white', fontWeight: '600', cursor: 'pointer', fontSize: '14px' }}>
                  {submitting ? 'Creating...' : 'Create Field'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}