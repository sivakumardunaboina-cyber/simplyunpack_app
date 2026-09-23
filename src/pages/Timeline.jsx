import { useNavigate } from 'react-router-dom';
import { useApp } from '../store/AppStore.jsx';
import { STAGES } from '../data/content.js';
import { doneIndex, liveMetrics } from '../lib/move.js';
import Screen from '../components/Screen.jsx';
import BackButton from '../components/BackButton.jsx';

const initials = (n) => n.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();

export default function Timeline() {
  const nav = useNavigate();
  const { s, tick } = useApp();
  const idx = doneIndex(s.stage);
  const live = liveMetrics(tick);

  return (
    <Screen>
      <div className="page">
        <BackButton to="/move" />
        <h1 className="h1">Move timeline</h1>
        <p className="lead">SU-4827 · every stage, who’s on it, and what’s still open.</p>
        <div>
          {STAGES.map((st, i) => {
            const done = i < idx;
            const isLive = s.stage === 'live' && i === 4;
            const last = i === STAGES.length - 1;
            const tap = () => {
              if (isLive) nav('/move/track');
              else if (last && s.stage !== 'new' && s.stage !== 'quote') nav(s.stage === 'done' ? '/move/invoice' : '/move/handover');
            };
            return (
              <div key={st.id} className="tl-item" role="button" tabIndex={0} onClick={tap} onKeyDown={(e) => e.key === 'Enter' && tap()}>
                <div className="tl-rail">
                  <span className={`tl-dot${done ? ' done' : isLive ? ' live' : ''}`}>{done ? '✓' : ''}</span>
                  <span className={`tl-line${done ? ' done' : ''}`} style={{ background: last ? 'transparent' : undefined }} />
                </div>
                <div className="tl-body">
                  <div className="row between" style={{ alignItems: 'baseline' }}>
                    <span className={`tl-name${done || isLive ? '' : ' pending'}`}>{st.name}</span>
                    <span className="tl-when">{st.when}</span>
                  </div>
                  <div className="tl-note">{st.note}</div>
                  {isLive && (
                    <div className="cream" style={{ marginTop: 11, padding: '14px 16px' }}>
                      <div className="eyebrow" style={{ fontSize: 10 }}>● Live</div>
                      <div className="progress dark" style={{ height: 5, marginBottom: 9 }}><div style={{ width: live.progress }} /></div>
                      <div className="row between small mb-12" style={{ fontSize: 11.5, fontWeight: 500 }}><span>{live.cratesLine}</span><span>{live.etaLine}</span></div>
                      <button type="button" className="btn btn-pink btn-sm" style={{ height: 42 }} onClick={(e) => { e.stopPropagation(); nav('/move/track'); }}>Track live location</button>
                    </div>
                  )}
                  {(done || isLive) && (
                    <div className="card row" style={{ marginTop: 11, padding: '12px 14px', gap: 11 }}>
                      <span className="avatar md">{initials(st.crew)}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div className="strong" style={{ fontSize: 13 }}>{st.crew}</div>
                        <div className="small" style={{ fontSize: 11 }}>{st.role}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <div className="navy">
          <div className="title">Anything unexpected comes to you first</div>
          <div className="text">We document it, keep unaffected work moving, and ask for approval before any paid or irreversible work.</div>
        </div>
      </div>
    </Screen>
  );
}
