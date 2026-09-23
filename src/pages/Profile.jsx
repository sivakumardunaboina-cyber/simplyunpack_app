import { useNavigate } from 'react-router-dom';
import { useApp } from '../store/AppStore.jsx';
import { config, whatsappLink } from '../config.js';
import { unreadCount } from '../lib/move.js';
import Screen from '../components/Screen.jsx';
import Toggle from '../components/Toggle.jsx';

export default function Profile() {
  const nav = useNavigate();
  const { s, set, flash, row, signOut } = useApp();
  const unread = unreadCount(s);

  const title = s.account ? `${s.name.trim() || 'Your account'}${s.stage !== 'new' ? ' · SU-4827' : ''}` : 'Browsing as a guest';
  const note = s.account
    ? s.stage === 'new' ? 'Your profile is saved. Build a quote and book a free survey whenever you’re ready.' : 'Your move, crew updates and handover records all live here.'
    : 'Quotes and survey slots work without an account. Create one and your move gets a timeline you can follow day by day.';
  const cta = s.account
    ? s.stage === 'new' ? { label: 'Build my quote', to: '/quote' } : { label: 'Open my move', to: '/move' }
    : { label: 'Create an account', to: '/auth/signup' };

  const rows = [
    { k: 'Your move', v: `${s.fromArea} → ${s.area}`, to: '/onboarding/1' },
    { k: s.account ? 'Your move' : 'Your plan', v: s.account ? (s.stage === 'new' ? 'Not booked' : 'SU-4827') : (s.plan.length ? `${s.plan.length} add-ons` : 'Package only'), to: s.account ? '/move' : '/plan' },
    { k: 'Coverage areas', v: 'Bengaluru', to: '/coverage' },
    { k: 'Reviews & trust', v: '4.9 average', to: '/reviews' },
    { k: 'Help & support', v: 'Chat · WhatsApp', to: '/support' },
    { k: 'Notifications', v: s.account ? (unread ? `${unread} new` : 'Up to date') : 'After booking', to: '/notifications' },
  ];

  return (
    <Screen tabs>
      <div className="page">
        <h1 className="h1" style={{ marginBottom: 20 }}>You</h1>
        <div className="cream" style={{ padding: 20, marginBottom: 12 }}>
          <div className="strong" style={{ fontSize: 15.5, marginBottom: 7 }}>{title}</div>
          <div className="small" style={{ fontSize: 13, marginBottom: 18 }}>{note}</div>
          <button type="button" className="btn btn-pink" onClick={() => nav(cta.to)}>{cta.label}</button>
          {!s.account && <button type="button" className="btn-link" style={{ width: '100%', paddingBottom: 0 }} onClick={() => nav('/auth/login')}>Already have an account? Sign in</button>}
        </div>
        <div className="mb-12">
          <Toggle on={s.remote} onChange={(v) => set({ remote: v })} title="Remote setup mode"
            sub={s.remote ? 'On — photo and video approvals, verified mover handoff.' : 'Off — you will be there on setup day.'} />
        </div>
        <div className="card list mb-12">
          {rows.map((r) => (
            <button type="button" key={r.k} className="list-row" onClick={() => nav(r.to)}><span>{r.k}</span><span className="meta">{r.v}</span></button>
          ))}
          {s.account && (
            <button type="button" className="list-row" onClick={() => { signOut(); flash('Signed out.'); nav('/'); }}><span>Sign out</span><span className="meta" /></button>
          )}
        </div>
        <div className="navy">
          <div className="title">Talk to a human</div>
          <div className="text">
            <a href={`tel:${config.supportPhone}`} style={{ color: '#fff' }}>{config.supportPhone}</a> · <a href={`mailto:${config.supportEmail}`} style={{ color: '#fff' }}>{config.supportEmail}</a>.{' '}
            <a href={whatsappLink()} target="_blank" rel="noreferrer" style={{ color: 'var(--yellow)' }}>WhatsApp</a> answers fastest on move week.
          </div>
        </div>
      </div>
    </Screen>
  );
}
