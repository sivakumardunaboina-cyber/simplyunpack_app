import { useApp } from '../store/AppStore.jsx';
import { api } from '../services/api.js';
import { TAP_FIX_PRICE } from '../data/content.js';
import { fmt } from '../lib/format.js';
import Screen from '../components/Screen.jsx';
import BackButton from '../components/BackButton.jsx';

const ITEMS = [
  { key: 'tap', tag: 'Issue found', tagClass: 'tag-pink', img: '/assets/home-readiness.png', alt: 'Technician inspecting a kitchen tap',
    title: 'Kitchen tap cartridge is leaking', text: 'Found while loading the sink cabinet. Manoj can replace it today; the rest of the kitchen continues either way.',
    cost: TAP_FIX_PRICE, yes: 'Approve fix', no: 'Fix later', yesVal: 'yes', noVal: 'no',
    status: { yes: `Approved · ${fmt(TAP_FIX_PRICE)} added to your balance`, no: 'Added to the punch list' },
    toast: { yes: 'Approved. Manoj is fixing the tap now.', no: 'Added to your punch list.' } },
  { key: 'ward', tag: 'Photo approval', tagClass: 'tag-yellow', img: '/assets/unpack-setup.png', alt: 'Wardrobe arranged by the Simply Unpack crew',
    title: 'Master wardrobe layout', text: 'Hung by category and daily use, work clothes at eye level. Approve or tell the crew what to move.',
    yes: 'Looks good', no: 'Ask for changes', yesVal: 'yes', noVal: 'change',
    status: { yes: 'Approved', change: 'Sent back to the crew with your note' },
    toast: { yes: 'Wardrobe approved.', change: 'Sent back to the crew.' } },
];

export default function Approvals() {
  const { s, set, flash } = useApp();

  const decide = async (item, val) => {
    set((p) => ({ appr: { ...p.appr, [item.key]: val }, read: p.read.includes(item.key) ? p.read : p.read.concat(item.key) }));
    flash(item.toast[val]);
    try { await api.submitApproval({ id: item.key, decision: val }); } catch { flash('Saved on this device. We’ll sync when you’re back online.'); }
  };
  const undo = (item) => set((p) => ({ appr: { ...p.appr, [item.key]: null } }));

  return (
    <Screen>
      <div className="page">
        <BackButton />
        <h1 className="h1">Waiting on you</h1>
        <p className="lead">Only these are on hold. Everything else keeps moving.</p>
        <div className="stack lg">
          {ITEMS.map((it) => {
            const v = s.appr[it.key];
            return (
              <div key={it.key} className="card">
                <img src={it.img} alt={it.alt} className="img-cover" style={{ height: 150 }} />
                <div style={{ padding: '17px 19px' }}>
                  <span className={`${it.tagClass} mb-12`}>{it.tag}</span>
                  <div className="strong" style={{ fontSize: 15.5, margin: '11px 0 6px' }}>{it.title}</div>
                  <div className="small" style={{ fontSize: 12.5, marginBottom: 12 }}>{it.text}</div>
                  {it.cost ? <div className="kv mb-16" style={{ fontSize: 13 }}><span>Parts and labour</span><b>{fmt(it.cost)}</b></div> : null}
                  {!v ? (
                    <div className="row" style={{ gap: 9 }}>
                      <button type="button" className="btn btn-pink btn-sm" onClick={() => decide(it, it.yesVal)}>{it.yes}</button>
                      <button type="button" className="btn btn-outline btn-sm" onClick={() => decide(it, it.noVal)}>{it.no}</button>
                    </div>
                  ) : (
                    <div className="cream row between" style={{ padding: '12px 14px', borderRadius: 12 }}>
                      <span className="strong" style={{ fontSize: 12.5 }}>✓ {it.status[v]}</span>
                      <button type="button" className="btn-link" style={{ padding: 0, fontSize: 12 }} onClick={() => undo(it)}>Change</button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Screen>
  );
}
