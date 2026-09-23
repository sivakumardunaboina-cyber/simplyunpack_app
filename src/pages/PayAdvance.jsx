import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../store/AppStore.jsx';
import { api } from '../services/api.js';
import { PAY } from '../data/content.js';
import { fmt } from '../lib/format.js';
import Screen from '../components/Screen.jsx';
import BackButton from '../components/BackButton.jsx';
import Option, { Radio } from '../components/Option.jsx';

export default function PayAdvance() {
  const nav = useNavigate();
  const { s, set, flash, quote } = useApp();
  const [busy, setBusy] = useState(false);
  const method = PAY.find((p) => p.v === s.payMethod) || PAY[0];

  // (MOCK) Replace api.payAdvance with your gateway checkout (e.g. open the gateway SDK with VITE_PAYMENT_KEY_ID,
  // then verify the payment signature on your server before marking the booking as paid).
  const pay = async () => {
    setBusy(true);
    try {
      await api.payAdvance({ amount: quote.adv, method: s.payMethod });
      set((p) => ({ stage: 'live', read: p.read.includes('quote') ? p.read : p.read.concat('quote') }));
      flash('Advance paid. Your crew and dates are locked.');
      nav('/move', { replace: true });
    } catch (e) {
      flash(e.message || 'Payment failed. Nothing was charged.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Screen cta={{ note: method.label, value: fmt(quote.adv), label: `Pay ${fmt(quote.adv)}`, onClick: pay, busy }}>
      <div className="page">
        <BackButton to="/move/quote" />
        <h1 className="h1">Pay the advance</h1>
        <p className="lead">Locks your crew, truck and society lift slot.</p>
        <div className="cream total mb-20" style={{ padding: '18px 20px' }}>
          <span style={{ fontWeight: 500, fontSize: 13.5 }}>20% of {fmt(quote.total)}</span>
          <b style={{ fontSize: 24 }}>{fmt(quote.adv)}</b>
        </div>
        <div className="label">Pay with</div>
        <div className="stack mb-16">
          {PAY.map((p) => <Option key={p.v} selected={s.payMethod === p.v} onClick={() => set({ payMethod: p.v })} lead={<Radio on={s.payMethod === p.v} />} title={p.label} sub={p.note} />)}
        </div>
        <p className="small">The {fmt(quote.balBase)} balance is due at handover. Pay it the same way, or in cash or UPI to the crew lead.</p>
      </div>
    </Screen>
  );
}
