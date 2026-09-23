import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../store/AppStore.jsx';
import { api } from '../services/api.js';
import { PAY, CASH, QC_ROOMS, TAP_FIX_PRICE } from '../data/content.js';
import { fmt } from '../lib/format.js';
import Screen from '../components/Screen.jsx';
import BackButton from '../components/BackButton.jsx';
import Option, { Radio } from '../components/Option.jsx';

export default function Handover() {
  const nav = useNavigate();
  const { s, set, flash, quote } = useApp();
  const [busy, setBusy] = useState(false);
  const methods = PAY.concat(CASH);
  const method = methods.find((p) => p.v === s.balMethod) || PAY[0];

  const punch = [
    { t: 'Bedroom 2 curtain rod', d: 'Bracket on back order. Fitting Saturday, no charge.' },
    ...(s.appr.tap === 'no' ? [{ t: 'Kitchen tap cartridge', d: `You chose to fix later. ${fmt(TAP_FIX_PRICE)} whenever you’re ready.` }] : []),
    ...(s.appr.ward === 'change' ? [{ t: 'Master wardrobe', d: 'Rearranged per your note. Re-check at walkthrough.' }] : []),
  ];

  const signOff = async () => {
    setBusy(true);
    try {
      if (s.balMethod !== 'cash') await api.payBalance({ amount: quote.bal, method: s.balMethod });
      set((p) => ({ stage: 'done', read: p.read.includes('hand') ? p.read : p.read.concat('hand') }));
      flash('Handover signed. Welcome home.');
      nav('/move/rate', { replace: true });
    } catch (e) {
      flash(e.message || 'Payment failed. Nothing was charged.');
    } finally {
      setBusy(false);
    }
  };

  const done = s.stage === 'done';

  return (
    <Screen cta={done ? null : { note: `Balance · ${method.label}`, value: fmt(quote.bal), label: s.balMethod === 'cash' ? 'Sign off' : 'Sign off & pay', onClick: signOff, busy }}>
      <div className="page">
        <BackButton to="/move" />
        <h1 className="h1">Handover</h1>
        <p className="lead">{done ? 'Signed off. Your photo and video record is saved.' : 'Walk through with Lakshmi K., or approve from the photos if you’re away.'}</p>
        <img src="/assets/handover.png" alt="Crew handing over a finished home" className="img-cover mb-20" style={{ height: 160, borderRadius: 18 }} />
        <div className="label">Quality check</div>
        <div className="card list mb-20">
          {QC_ROOMS.map((r) => (
            <div key={r} className="row" style={{ padding: '13px 17px', gap: 12 }}>
              <span className="tick">✓</span>
              <span className="body" style={{ flex: 1, fontWeight: 500 }}>{r}</span>
              <span className="small" style={{ fontSize: 11.5 }}>photo + video</span>
            </div>
          ))}
        </div>
        <div className="label">Punch list</div>
        <div className="stack mb-20">
          {punch.map((p) => (
            <div key={p.t} className="cream" style={{ padding: '14px 16px' }}>
              <div className="strong" style={{ fontSize: 13.5 }}>{p.t}</div>
              <div className="small" style={{ marginTop: 4 }}>{p.d}</div>
            </div>
          ))}
        </div>
        {!done && (
          <>
            <div className="label">Pay the balance · {fmt(quote.bal)}</div>
            <div className="stack">
              {methods.map((p) => <Option key={p.v} selected={s.balMethod === p.v} onClick={() => set({ balMethod: p.v })} lead={<Radio on={s.balMethod === p.v} />} title={p.label} sub={p.note} />)}
            </div>
          </>
        )}
      </div>
    </Screen>
  );
}
