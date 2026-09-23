import { useNavigate } from 'react-router-dom';
import { useApp } from '../store/AppStore.jsx';
import { ARRANGEMENTS } from '../data/content.js';
import { fmt } from '../lib/format.js';
import { liveMetrics, pendingApprovals, approvalsLabel, doneIndex, moveDay } from '../lib/move.js';
import Screen from '../components/Screen.jsx';
import BellButton from '../components/BellButton.jsx';

export default function MyMove() {
  const nav = useNavigate();
  const { s, row, quote, tick } = useApp();
  const live = liveMetrics(tick);
  const pending = pendingApprovals(s.appr);
  const done = doneIndex(s.stage);
  const mode = s.remote ? 'Remote setup' : 'You on site';

  return (
    <Screen tabs>
      <div className="page">
        <div className="row between" style={{ marginBottom: 6 }}>
          <h1 className="h1" style={{ margin: 0 }}>Your move</h1>
          <BellButton />
        </div>
        <p className="lead">{s.stage !== 'new' ? 'SU-4827 · ' : ''}{s.fromArea} → {s.area} · {row.label} · {mode}</p>

        {s.stage === 'new' && (
          <div className="cream" style={{ padding: '22px 20px', marginBottom: 14 }}>
            <div className="strong" style={{ fontSize: 19, marginBottom: 7 }}>No move booked yet</div>
            <div className="small" style={{ fontSize: 13, marginBottom: 18 }}>Build a quote and book a free survey. Once it’s done, your timeline, crew and live tracking show up here.</div>
            <button type="button" className="btn btn-pink mb-12" onClick={() => nav('/quote')}>Build my quote</button>
            <button type="button" className="btn-link" style={{ width: '100%', padding: 8 }} onClick={() => nav('/support')}>Talk to us first</button>
          </div>
        )}

        {s.stage === 'quote' && (
          <div className="cream" style={{ padding: 20, marginBottom: 14 }}>
            <div className="row" style={{ gap: 8, marginBottom: 12 }}>
              <span className="dot-live" style={{ background: 'var(--pink)' }} />
              <span className="eyebrow" style={{ margin: 0 }}>Action needed</span>
            </div>
            <div className="strong" style={{ fontSize: 19, marginBottom: 7 }}>Your written quote is ready</div>
            <div className="small" style={{ fontSize: 13, marginBottom: 16 }}>Prepared by Arun P. after Saturday’s survey. Approve with a 20% advance to lock your crew and dates.</div>
            <div className="total mb-16"><span style={{ fontWeight: 400, fontSize: 13, color: 'var(--muted)' }}>Total</span><b style={{ fontSize: 22 }}>{fmt(quote.total)}</b></div>
            <button type="button" className="btn btn-pink" onClick={() => nav('/move/quote')}>Review &amp; approve</button>
          </div>
        )}

        {s.stage === 'done' && (
          <div style={{ background: 'var(--ink)', borderRadius: 20, overflow: 'hidden', marginBottom: 14 }}>
            <img src="/assets/handover.png" alt="Simply Unpack handing over keys to a couple in a finished home" className="img-cover" style={{ height: 150 }} />
            <div style={{ padding: 20 }}>
              <div className="eyebrow yellow">Handed over</div>
              <div style={{ font: '600 19px/1.25 Poppins', color: '#fff', marginBottom: 7 }}>Your home is ready</div>
              <div style={{ font: '400 13px/1.55 Poppins', color: 'rgba(255,255,255,.8)', marginBottom: 16 }}>Photos, punch list and invoice are saved here. We’ll be back Saturday for the curtain rod.</div>
              <div className="row" style={{ gap: 9 }}>
                <button type="button" className="btn btn-yellow btn-sm" onClick={() => nav('/move/invoice')}>View invoice</button>
                <button type="button" className="btn btn-outline-light btn-sm" onClick={() => nav('/move/rate')}>Rate the crew</button>
              </div>
            </div>
          </div>
        )}

        {s.stage === 'live' && (
          <>
            {pending > 0 && (
              <button type="button" className="banner-yellow mb-12" onClick={() => nav('/move/approvals')}><span>{approvalsLabel(pending)}</span><span>›</span></button>
            )}
            <div className="hero mb-16">
              <button type="button" onClick={() => nav('/move/timeline')} style={{ all: 'unset', display: 'block', cursor: 'pointer', padding: '20px 20px 22px', width: '100%', boxSizing: 'border-box' }}>
                <div className="row" style={{ gap: 8, marginBottom: 12 }}><span className="dot-live" /><span className="eyebrow yellow" style={{ margin: 0 }}>Happening now</span></div>
                <div style={{ font: '600 20px/1.25 Poppins', color: '#fff', marginBottom: 8 }}>Moving day</div>
                <div style={{ font: '400 13px/1.55 Poppins', color: 'rgba(255,255,255,.85)', marginBottom: 18 }}>Crates packed and loaded at {s.fromArea}. Room-wise placement on arrival, then unpacking, kitchen and wardrobes.</div>
                <div className="progress" style={{ marginBottom: 10 }}><div style={{ width: live.progress }} /></div>
                <div className="row between" style={{ font: '500 11.5px/1 Poppins', color: 'rgba(255,255,255,.8)' }}><span>{live.cratesLine}</span><span>{live.etaLine}</span></div>
              </button>
              <button type="button" onClick={() => nav('/move/track')} className="row between" style={{ width: '100%', background: 'var(--ink)', padding: '15px 20px', border: 'none', cursor: 'pointer', color: 'var(--yellow)', font: '600 14px/1 Poppins' }}>
                <span>Track the truck live</span><span>›</span>
              </button>
            </div>
            <div className="row mb-16" style={{ gap: 9, alignItems: 'stretch' }}>
              <div className="stat"><b>{done}</b><span>stages done</span></div>
              <div className="stat"><b>{10 - done}</b><span>still to come</span></div>
              <div className="stat"><b>Thu</b><span>handover</span></div>
            </div>
            <div className="label">Arrangements we’ve made for you</div>
            <div className="card list mb-16">
              {ARRANGEMENTS.map((a) => (
                <div key={a.k} className="row" style={{ padding: '14px 17px', gap: 12 }}>
                  <span className={`tick${a.ok ? '' : ' off'}`}>{a.ok ? '✓' : '·'}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="body" style={{ fontWeight: 500, lineHeight: 1.3 }}>{a.k}</div>
                    <div className="small" style={{ fontSize: 11.5, marginTop: 3, lineHeight: 1.4 }}>{a.v}</div>
                  </div>
                </div>
              ))}
            </div>
            <button type="button" className="cream row between mb-12" style={{ width: '100%', padding: '15px 18px', border: 'none', cursor: 'pointer', textAlign: 'left' }} onClick={() => nav('/move/handover')}>
              <span>
                <span className="strong" style={{ display: 'block', fontSize: 13.5 }}>Handover &amp; sign-off</span>
                <span className="small" style={{ display: 'block', fontSize: 11.5, marginTop: 3 }}>Room-by-room QC, punch list, balance {fmt(quote.bal)}</span>
              </span>
              <span className="strong">›</span>
            </button>
          </>
        )}

        {s.stage !== 'new' && (
          <>
            <button type="button" className="btn btn-outline mb-12" onClick={() => nav('/move/timeline')}>See the full timeline</button>
            <div className="card list">
              <button type="button" className="list-row" onClick={() => nav('/move/manage')}><span>Reschedule or cancel</span><span className="meta">{moveDay(s)}</span></button>
              <button type="button" className="list-row" onClick={() => nav('/support')}><span>Chat with support</span><span className="meta">~2 min reply</span></button>
            </div>
          </>
        )}
      </div>
    </Screen>
  );
}
