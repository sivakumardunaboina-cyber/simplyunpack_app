import { useNavigate } from 'react-router-dom';
import { useApp } from '../store/AppStore.jsx';
import { SLOTS } from '../data/content.js';

const NEXT = ['We confirm on WhatsApp within the hour.', 'Survey walks your inventory, access and lift timings.', 'You get the quote in writing, then decide.'];

export default function SurveyBooked() {
  const nav = useNavigate();
  const { s, row } = useApp();
  const slot = (SLOTS.find((x) => x.v === s.slot) || SLOTS[0]).label.toLowerCase();

  return (
    <main className="screen">
      <div className="page center" style={{ paddingTop: 72 }}>
        <div className="success-mark">✓</div>
        <h1 className="h1">Survey booked</h1>
        <p className="lead" style={{ maxWidth: 290, margin: '0 auto 24px' }}>A surveyor will be at your {row.label} in {s.area} at {slot}.</p>
        <div className="cream" style={{ padding: 20, textAlign: 'left', marginBottom: 16 }}>
          <div className="eyebrow muted">What happens next</div>
          <div className="stack">
            {NEXT.map((t, i) => (
              <div key={t} className="row" style={{ alignItems: 'flex-start', gap: 11 }}>
                <span className="tick" style={{ background: 'var(--pink)', color: '#fff', marginTop: 2 }}>{i + 1}</span>
                <span className="body" style={{ fontSize: 13, lineHeight: 1.5 }}>{t}</span>
              </div>
            ))}
          </div>
        </div>
        <button type="button" className="btn btn-pink" style={{ height: 52 }} onClick={() => nav(s.account ? '/move' : '/auth/signup')}>
          {s.account ? 'Go to your move' : 'Create an account to follow it'}
        </button>
        <button type="button" className="btn-link muted" style={{ padding: 16 }} onClick={() => nav('/')}>Back to browsing</button>
      </div>
    </main>
  );
}
