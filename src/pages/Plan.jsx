import { useNavigate } from 'react-router-dom';
import { useApp } from '../store/AppStore.jsx';
import { SERVICES } from '../data/content.js';
import Screen from '../components/Screen.jsx';

export default function Plan() {
  const nav = useNavigate();
  const { s, set, row } = useApp();
  const items = s.plan.map((id) => SERVICES.find((x) => x.id === id)).filter(Boolean);
  const n = items.length;

  return (
    <Screen tabs cta={{ note: 'Indicative, before add-ons', value: row.price, label: 'Build my quote', onClick: () => { set({ addons: s.plan.slice() }); nav('/quote'); } }}>
      <div className="page">
        <h1 className="h1">Your plan</h1>
        <p className="lead">{n ? `${n} ${n === 1 ? 'add-on' : 'add-ons'} on top of your package. Kept on this device.` : 'Your package, plus anything you add while browsing.'}</p>
        <div className="cream" style={{ padding: '18px 20px', marginBottom: 14 }}>
          <div className="row between" style={{ marginBottom: 6 }}>
            <div className="strong" style={{ fontSize: 15 }}>{row.label} end-to-end package</div>
            <div className="strong" style={{ fontSize: 15 }}>{row.price}</div>
          </div>
          <div className="small">Pre-pack valuables, packing &amp; moving, unpacking, organising and home setup. {row.hours}</div>
        </div>
        {n > 0 ? (
          <div className="stack mb-16">
            {items.map((x) => (
              <div key={x.id} className="card row" style={{ padding: 13, gap: 12 }}>
                <img src={x.img} alt={x.alt} className="img-cover" style={{ width: 52, height: 52, flex: 'none', borderRadius: 11 }} />
                <button type="button" style={{ flex: 1, minWidth: 0, background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', padding: 0 }} onClick={() => nav(`/services/${x.id}`)}>
                  <div className="strong" style={{ fontSize: 14 }}>{x.name}</div>
                  <div className="small" style={{ marginTop: 3 }}>{x.price}</div>
                </button>
                <button type="button" aria-label={`Remove ${x.name}`} className="icon-btn" style={{ width: 30, height: 30 }} onClick={() => set((p) => ({ plan: p.plan.filter((y) => y !== x.id) }))}>×</button>
              </div>
            ))}
          </div>
        ) : (
          <div className="center mb-16" style={{ border: '1px dashed rgba(36,26,86,.2)', borderRadius: 16, padding: '30px 22px' }}>
            <div className="strong" style={{ fontSize: 14, marginBottom: 6 }}>No add-ons yet</div>
            <div className="small">Add cleaning, pest control, installations or readiness checks from any service page.</div>
          </div>
        )}
        <div className="navy">
          <div className="row between" style={{ marginBottom: 8 }}>
            <span style={{ font: '600 14.5px/1 Poppins' }}>Indicative total</span>
            <span style={{ font: '600 21px/1 Poppins', color: 'var(--yellow)' }}>{row.price}+</span>
          </div>
          <div className="text">Add-ons are quoted after the free survey, so they are not in this number yet.</div>
        </div>
      </div>
    </Screen>
  );
}
