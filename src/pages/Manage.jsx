import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../store/AppStore.jsx';
import { api } from '../services/api.js';
import { RESCHED, CANCEL_POLICY } from '../data/content.js';
import { fmt } from '../lib/format.js';
import { moveDay } from '../lib/move.js';
import Screen from '../components/Screen.jsx';
import BackButton from '../components/BackButton.jsx';
import Chip from '../components/Chip.jsx';

export default function Manage() {
  const nav = useNavigate();
  const { s, set, flash, quote } = useApp();
  const [pick, setPick] = useState(null);
  const [ask, setAsk] = useState(false);
  const [busy, setBusy] = useState(false);

  const consequence = {
    new: 'Nothing is booked yet.',
    quote: 'Nothing is paid yet, so cancelling costs nothing.',
    live: `Your move is within 48 hours, so the ${fmt(quote.adv)} advance would be forfeited.`,
    done: 'This move is complete and can’t be cancelled.',
  }[s.stage];

  const reschedule = async () => {
    if (!pick) return;
    setBusy(true);
    try {
      await api.reschedule({ date: pick });
      set({ resched: `${pick} · requested` });
      flash(`Requested ${pick}. Confirmation on WhatsApp.`);
      setPick(null);
    } catch (e) { flash(e.message || 'Could not reschedule.'); } finally { setBusy(false); }
  };

  const cancel = async () => {
    setBusy(true);
    try {
      await api.cancel({});
      flash('Cancellation requested. A coordinator will call to confirm.');
      nav('/move', { replace: true });
    } catch (e) { flash(e.message || 'Could not cancel.'); } finally { setBusy(false); setAsk(false); }
  };

  return (
    <Screen>
      <div className="page">
        <BackButton to="/move" />
        <h1 className="h1" style={{ marginBottom: 20 }}>Reschedule or cancel</h1>
        <div className="cream kv mb-24" style={{ padding: '16px 18px' }}><span style={{ fontWeight: 500 }}>Move day</span><b>{moveDay(s)}</b></div>
        {s.stage !== 'done' && (
          <>
            <div className="label">Pick a new date</div>
            <div className="grid-2 mb-12">
              {RESCHED.map((d) => <Chip key={d} selected={pick === d} onClick={() => setPick(d)}>{d}</Chip>)}
            </div>
            <p className="small mb-16">{s.stage === 'live' ? 'Your move is within 48 hours. The crew lead confirms any new date before it’s locked.' : 'Free to change. We’ll confirm the new date on WhatsApp.'}</p>
            <button type="button" className="btn btn-pink mb-24" disabled={!pick || busy} onClick={reschedule}>{pick ? `Move to ${pick}` : 'Pick a new date'}</button>
          </>
        )}
        <div className="card card-pad">
          <div className="strong" style={{ fontSize: 14.5, marginBottom: 7 }}>Cancel booking</div>
          <div className="small" style={{ fontSize: 12.5, marginBottom: 10 }}>{CANCEL_POLICY}</div>
          <div style={{ font: '600 12.5px/1.6 Poppins', color: 'var(--pink-dark)', marginBottom: 16 }}>{consequence}</div>
          {s.stage !== 'done' && s.stage !== 'new' && (!ask ? (
            <button type="button" className="btn btn-danger-outline btn-sm" onClick={() => setAsk(true)}>Cancel booking</button>
          ) : (
            <div className="row" style={{ gap: 9 }}>
              <button type="button" className="btn btn-danger btn-sm" disabled={busy} onClick={cancel}>Yes, cancel</button>
              <button type="button" className="btn btn-outline btn-sm" onClick={() => setAsk(false)}>Keep booking</button>
            </div>
          ))}
        </div>
      </div>
    </Screen>
  );
}
