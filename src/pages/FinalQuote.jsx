import { useNavigate } from 'react-router-dom';
import { useApp } from '../store/AppStore.jsx';
import { CANCEL_POLICY } from '../data/content.js';
import { fmt } from '../lib/format.js';
import Screen from '../components/Screen.jsx';
import BackButton from '../components/BackButton.jsx';

export default function FinalQuote() {
  const nav = useNavigate();
  const { quote } = useApp();

  return (
    <Screen cta={{ note: 'Advance today · 20%', value: fmt(quote.adv), label: 'Approve & pay', onClick: () => nav('/move/pay') }}>
      <div className="page">
        <BackButton to="/move" />
        <div className="eyebrow">SU-4827 · written quote</div>
        <h1 className="h1">Your final quote</h1>
        <p className="lead">Prepared by Arun P. after Saturday’s survey of your inventory and access. Valid for 7 days.</p>
        <div className="card card-pad mb-12">
          <div className="stack" style={{ gap: 12 }}>
            {quote.lines.map((l) => <div key={l.k} className="kv"><span>{l.k}</span><b style={{ whiteSpace: 'nowrap' }}>{l.v}</b></div>)}
          </div>
          <div className="divider" />
          <div className="total"><span>Total</span><b>{fmt(quote.total)}</b></div>
          <div className="small mt-8" style={{ fontSize: 11.5 }}>Inclusive of GST</div>
        </div>
        <div className="row mb-12" style={{ gap: 9, alignItems: 'stretch' }}>
          <div className="stat" style={{ background: 'var(--pink)' }}>
            <span style={{ margin: '0 0 8px', color: 'rgba(255,255,255,.8)', fontSize: 9.5, fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase' }}>Advance today · 20%</span>
            <b style={{ color: '#fff' }}>{fmt(quote.adv)}</b>
          </div>
          <div className="stat">
            <span style={{ margin: '0 0 8px', fontSize: 9.5, fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase' }}>At handover</span>
            <b>{fmt(quote.balBase)}</b>
          </div>
        </div>
        <div className="navy mb-12">
          <div className="title">Cancellation</div>
          <div className="text">{CANCEL_POLICY}</div>
        </div>
        <button type="button" className="btn-link" style={{ width: '100%' }} onClick={() => nav('/support')}>Ask about this quote</button>
      </div>
    </Screen>
  );
}
