import { useApp } from '../store/AppStore.jsx';
import { whatsappLink } from '../config.js';
import { PAY, CASH } from '../data/content.js';
import { fmt } from '../lib/format.js';
import Screen from '../components/Screen.jsx';
import BackButton from '../components/BackButton.jsx';

const label = (v) => (PAY.concat(CASH).find((p) => p.v === v) || PAY[0]).label;

export default function Invoice() {
  const { s, row, quote, flash } = useApp();
  const lines = quote.lines.concat(quote.extra ? [{ k: 'Kitchen tap cartridge (approved)', v: fmt(quote.extra) }] : []);
  const total = quote.total + quote.extra;
  const payments = [
    { k: `Advance · ${label(s.payMethod)}`, v: fmt(quote.adv), st: s.stage === 'quote' || s.stage === 'new' ? 'Due on approval' : 'Paid' },
    { k: `Balance · ${label(s.balMethod)}`, v: fmt(quote.bal), st: s.stage === 'done' ? 'Paid' : 'Due at handover' },
  ];

  // (MOCK) "Download PDF" uses the browser print dialog. In production, fetch a server-generated PDF.
  const download = () => window.print();
  const share = async () => {
    const text = `Simply Unpack invoice INV-4827 — ${fmt(total)} for ${row.label}, ${s.area}.`;
    if (navigator.share) {
      try { await navigator.share({ title: 'Simply Unpack invoice', text }); } catch { /* user cancelled */ }
    } else {
      window.open(whatsappLink(text), '_blank', 'noopener');
      flash('Opening WhatsApp to share…');
    }
  };

  return (
    <Screen>
      <div className="page">
        <div className="no-print"><BackButton to="/move" /></div>
        <div className="eyebrow">INV-4827</div>
        <h1 className="h1">Invoice</h1>
        <p className="lead">{row.label} · {s.area}, Bengaluru{s.name ? ` · ${s.name}` : ''}</p>
        <div className="card card-pad mb-12">
          <div className="stack" style={{ gap: 12 }}>
            {lines.map((l) => <div key={l.k} className="kv"><span>{l.k}</span><b style={{ whiteSpace: 'nowrap' }}>{l.v}</b></div>)}
          </div>
          <div className="divider" />
          <div className="total"><span>Total · incl. GST</span><b>{fmt(total)}</b></div>
        </div>
        <div className="cream stack mb-20" style={{ padding: '16px 20px', gap: 12 }}>
          {payments.map((p) => (
            <div key={p.k} className="row between" style={{ alignItems: 'flex-start' }}>
              <div>
                <div className="body" style={{ fontWeight: 500, fontSize: 13 }}>{p.k}</div>
                <div className="small" style={{ fontSize: 11.5 }}>{p.st}</div>
              </div>
              <b style={{ font: '600 14px/1.3 Poppins', whiteSpace: 'nowrap' }}>{p.v}</b>
            </div>
          ))}
        </div>
        <div className="row no-print" style={{ gap: 9 }}>
          <button type="button" className="btn btn-pink" onClick={download}>Download PDF</button>
          <button type="button" className="btn btn-outline" onClick={share}>Share</button>
        </div>
      </div>
    </Screen>
  );
}
