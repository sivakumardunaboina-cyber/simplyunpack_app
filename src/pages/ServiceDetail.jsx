import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../store/AppStore.jsx';
import { SERVICES } from '../data/content.js';
import Screen from '../components/Screen.jsx';

export default function ServiceDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const { s, set, row } = useApp();
  const sel = SERVICES.find((x) => x.id === id);
  if (!sel) return <Navigate to="/explore" replace />;

  const inPlan = s.plan.includes(sel.id);
  const togglePlan = () => set((p) => ({ plan: p.plan.includes(sel.id) ? p.plan.filter((x) => x !== sel.id) : p.plan.concat(sel.id) }));

  const cta = sel.addon
    ? { note: 'Add-on · quoted after survey', value: 'Add to your plan', label: inPlan ? 'In your plan' : 'Add',
        onClick: () => { if (!inPlan) togglePlan(); nav(s.account ? '/move' : '/plan'); } }
    : { note: 'Included in every package', value: row.price, label: 'Build quote', onClick: () => nav('/quote') };

  return (
    <Screen cta={cta}>
      <div className="detail-hero">
        <img src={sel.img} alt={sel.alt} className="img-cover" style={{ height: 268 }} />
        <div className="controls">
          <button type="button" className="round-btn" onClick={() => nav(-1)} aria-label="Back">‹</button>
          <button type="button" className={`pill-btn${inPlan ? ' is-on' : ''}`} onClick={togglePlan}>{inPlan ? 'In your plan' : 'Add to plan'}</button>
        </div>
      </div>
      <div className="page" style={{ paddingTop: 22 }}>
        {sel.addon ? <div className="tag-pink mb-12">Add-on service</div> : null}
        <h1 className="h1" style={{ marginBottom: 10 }}>{sel.name}</h1>
        <p className="lead" style={{ fontSize: 14, lineHeight: 1.65 }}>{sel.long}</p>
        <div className="row mb-24" style={{ gap: 9, alignItems: 'stretch' }}>
          <div className="stat"><span style={{ marginTop: 0, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '.12em', fontSize: 9.5, fontWeight: 600 }}>Pricing</span><b style={{ fontSize: 14.5 }}>{sel.price}</b></div>
          <div className="stat"><span style={{ marginTop: 0, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '.12em', fontSize: 9.5, fontWeight: 600 }}>Covers</span><b style={{ fontSize: 14.5 }}>{sel.covers}</b></div>
        </div>
        <h3 className="h3">What’s included</h3>
        <div className="card list mb-24">
          {sel.included.map((inc) => (
            <div key={inc} className="row" style={{ padding: '14px 17px', alignItems: 'flex-start', gap: 12 }}>
              <span className="tick">✓</span>
              <span className="body" style={{ fontSize: 13.5, lineHeight: 1.5 }}>{inc}</span>
            </div>
          ))}
        </div>
        <div className="cream" style={{ padding: '18px 20px' }}>
          <div className="strong" style={{ fontSize: 13.5, marginBottom: 7 }}>Before we leave</div>
          <div className="small">Room-by-room quality check with a photo and video handover, plus a punch list of anything still pending.</div>
        </div>
      </div>
    </Screen>
  );
}
