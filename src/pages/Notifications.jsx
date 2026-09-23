import { useNavigate } from 'react-router-dom';
import { useApp } from '../store/AppStore.jsx';
import { NOTIFS } from '../data/content.js';
import { visibleNotifs } from '../lib/move.js';
import Screen from '../components/Screen.jsx';
import BackButton from '../components/BackButton.jsx';

export default function Notifications() {
  const nav = useNavigate();
  const { s, set } = useApp();
  const list = visibleNotifs(s);
  const hasUnread = list.some((n) => !s.read.includes(n.id));

  const open = (n) => {
    set((p) => ({ read: p.read.includes(n.id) ? p.read : p.read.concat(n.id) }));
    nav(n.to);
  };

  return (
    <Screen>
      <div className="page">
        <div className="row between">
          <BackButton />
          {hasUnread && <button type="button" className="btn-link" style={{ padding: 0, marginBottom: 18 }} onClick={() => set({ read: NOTIFS.map((n) => n.id) })}>Mark all read</button>}
        </div>
        <h1 className="h1" style={{ marginBottom: 20 }}>Notifications</h1>
        {list.length ? (
          <div className="card list">
            {list.map((n) => (
              <button type="button" key={n.id} className="list-row" style={{ alignItems: 'flex-start', padding: '16px 18px' }} onClick={() => open(n)}>
                <span style={{ width: 8, height: 8, flex: 'none', marginTop: 6, borderRadius: 999, background: s.read.includes(n.id) ? 'transparent' : 'var(--pink)' }} />
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span className="row between" style={{ alignItems: 'flex-start' }}>
                    <span className="strong" style={{ fontSize: 13.5, lineHeight: 1.35 }}>{n.t}</span>
                    <span className="small" style={{ fontSize: 11, whiteSpace: 'nowrap' }}>{n.when}</span>
                  </span>
                  <span className="small" style={{ display: 'block', marginTop: 4, lineHeight: 1.5 }}>{n.d}</span>
                </span>
              </button>
            ))}
          </div>
        ) : (
          <div className="center" style={{ border: '1px dashed rgba(36,26,86,.2)', borderRadius: 16, padding: '30px 22px' }}>
            <div className="strong" style={{ fontSize: 14, marginBottom: 6 }}>Nothing yet</div>
            <div className="small">Quote, crew and truck updates appear here once you book.</div>
          </div>
        )}
      </div>
    </Screen>
  );
}
