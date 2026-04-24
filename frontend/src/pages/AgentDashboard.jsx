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

export default function AgentDashboard() {
  const { user, logout } = useAuth();
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedField, setSelectedField] = useState(null);
  const [updates, setUpdates] = useState([]);
  const [form, setForm] = useState({ note: '', stage: '' });
  const [submitting, setSubmitting] = useState(false);

  const fetchFields = async () => {
    try {
      const res = await API.get('/fields/mine');
      setFields(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchFields(); }, []);

  const openField = async (field) => {
    setSelectedField(field);
    setForm({ note: '', stage: field.stage });
    try {
      const res = await API.get(`/fields/${field.id}/updates`);
      setUpdates(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await API.post(`/fields/${selectedField.id}/updates`, form);
      setSelectedField(null);
      fetchFields();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const total = fields.length;
  const active = fields.filter(f => f.status === 'Active').length;
  const atRisk = fields.filter(f => f.status === 'At Risk').length;

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
        <div style={{ marginBottom: '1.5rem' }}>
          <h1 style={{ color: '#1B5E20', fontSize: '24px', fontWeight: '700', margin: 0 }}>My Fields</h1>
          <p style={{ color: '#558B2F', fontSize: '14px', margin: '4px 0 0' }}>Click a field to update its stage or add observations</p>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
          {[
            { label: 'My Fields', value: total, color: '#1B5E20', bg: 'white' },
            { label: 'Active', value: active, color: '#2E7D32', bg: '#E8F5E9' },
            { label: 'At Risk', value: atRisk, color: '#E65100', bg: '#FFF3E0' },
          ].map((stat) => (
            <div key={stat.label} style={{ background: stat.bg, borderRadius: '14px', padding: '1.25rem', border: '1px solid rgba(0,0,0,0.06)' }}>
              <div style={{ color: '#888', fontSize: '13px', marginBottom: '6px' }}>{stat.label}</div>
              <div style={{ color: stat.color, fontSize: '32px', fontWeight: '700' }}>{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Field Cards */}
        {loading ? (
          <div style={{ textAlign: 'center', color: '#888', padding: '3rem' }}>Loading your fields...</div>
        ) : fields.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#888', padding: '3rem' }}>No fields assigned to you yet.</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
            {fields.map(field => (
              <div key={field.id} onClick={() => openField(field)}
                style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', border: '1px solid rgba(0,0,0,0.06)', cursor: 'pointer', transition: 'transform 0.1s', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <h3 style={{ margin: 0, color: '#1B5E20', fontSize: '16px', fontWeight: '600' }}>{field.name}</h3>
                  {statusBadge(field.status)}
                </div>
                <div style={{ color: '#666', fontSize: '14px', marginBottom: '0.5rem' }}>🌱 {field.cropType}</div>
                <div style={{ color: '#666', fontSize: '14px', marginBottom: '1rem' }}>📅 Planted: {new Date(field.plantingDate).toLocaleDateString()}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  {stageBadge(field.stage)}
                  <span style={{ color: '#A5D6A7', fontSize: '12px' }}>Click to update →</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Update Modal */}
      {selectedField && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div style={{ background: 'white', borderRadius: '20px', padding: '2rem', width: '100%', maxWidth: '500px', margin: '1rem', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ color: '#1B5E20', margin: '0 0 0.25rem', fontSize: '18px' }}>{selectedField.name}</h2>
            <p style={{ color: '#888', fontSize: '13px', margin: '0 0 1.5rem' }}>{selectedField.cropType} · Planted {new Date(selectedField.plantingDate).toLocaleDateString()}</p>

            <form onSubmit={handleUpdate}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#444', marginBottom: '5px' }}>Update Stage</label>
                <select value={form.stage} onChange={(e) => setForm({ ...form, stage: e.target.value })} required
                  style={{ width: '100%', border: '1px solid #ddd', borderRadius: '8px', padding: '10px 12px', fontSize: '14px', outline: 'none' }}>
                  {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#444', marginBottom: '5px' }}>Observation / Note</label>
                <textarea value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} required rows={3}
                  placeholder="Describe what you observed in the field..."
                  style={{ width: '100%', boxSizing: 'border-box', border: '1px solid #ddd', borderRadius: '8px', padding: '10px 12px', fontSize: '14px', outline: 'none', resize: 'vertical' }} />
              </div>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '1.5rem' }}>
                <button type="button" onClick={() => setSelectedField(null)}
                  style={{ flex: 1, padding: '10px', border: '1px solid #ddd', borderRadius: '8px', background: 'white', cursor: 'pointer', fontSize: '14px' }}>
                  Cancel
                </button>
                <button type="submit" disabled={submitting}
                  style={{ flex: 1, padding: '10px', border: 'none', borderRadius: '8px', background: '#1B5E20', color: 'white', fontWeight: '600', cursor: 'pointer', fontSize: '14px' }}>
                  {submitting ? 'Saving...' : 'Save Update'}
                </button>
              </div>
            </form>

            {/* Update History */}
            {updates.length > 0 && (
              <div>
                <h3 style={{ color: '#1B5E20', fontSize: '14px', fontWeight: '600', marginBottom: '0.75rem' }}>Update History</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {updates.map(u => (
                    <div key={u.id} style={{ background: '#F9FBF9', borderRadius: '8px', padding: '10px 12px', border: '1px solid #E8F5E9' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        {stageBadge(u.stage)}
                        <span style={{ color: '#aaa', fontSize: '11px' }}>{new Date(u.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p style={{ margin: 0, color: '#555', fontSize: '13px' }}>{u.note}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}