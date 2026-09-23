import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SERVICES, FILTERS, DAY_ONE, BEFORE } from '../data/content.js';
import Screen from '../components/Screen.jsx';
import Chip from '../components/Chip.jsx';
import { IconSearch } from '../components/Icons.jsx';

export default function Explore() {
  const nav = useNavigate();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('All');
  const q = query.trim().toLowerCase();

  const list = SERVICES.filter((x) => {
    const okF = filter === 'All'
      || (filter === 'Core service' && !x.addon)
      || (filter === 'Add-on' && x.addon)
      || (filter === 'Home setup' && DAY_ONE.includes(x.id))
      || (filter === 'Packing & moving' && BEFORE.includes(x.id));
    const okQ = !q || `${x.name} ${x.blurb} ${x.long}`.toLowerCase().includes(q);
    return okF && okQ;
  });

  return (
    <Screen tabs>
      <div style={{ padding: '24px 20px 14px', position: 'sticky', top: 0, zIndex: 5, background: 'var(--paper)', borderBottom: '1px solid var(--line-soft)' }}>
        <h1 className="h1" style={{ marginBottom: 14 }}>Services</h1>
        <label className="field mb-12" style={{ padding: '13px 15px' }}>
          <IconSearch width="16" height="16" style={{ color: 'var(--muted)' }} />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search kitchen, wardrobe, pest control…" aria-label="Search services" style={{ fontSize: 14, fontWeight: 400 }} />
        </label>
        <div className="chips scroll">
          {FILTERS.map((f) => <Chip key={f} small selected={filter === f} onClick={() => setFilter(f)}>{f}</Chip>)}
        </div>
      </div>
      <div className="page stack" style={{ paddingTop: 16, gap: 11 }}>
        {list.map((x) => (
          <button type="button" key={x.id} className="card" style={{ display: 'flex', gap: 13, padding: 12, textAlign: 'left', cursor: 'pointer', width: '100%' }} onClick={() => nav(`/services/${x.id}`)}>
            <img src={x.img} alt={x.alt} className="img-cover" style={{ width: 82, height: 82, flex: 'none', borderRadius: 12 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="svc-name" style={{ marginBottom: 0 }}>{x.name}</div>
              <div className="small" style={{ margin: '5px 0 8px', lineHeight: 1.5 }}>{x.blurb}</div>
              <div className="row wrap" style={{ gap: 6 }}>
                <span className="tag-soft">{x.kind}</span>
                <span className="tag-soft">{x.foot}</span>
              </div>
            </div>
          </button>
        ))}
        {list.length === 0 && (
          <div className="center" style={{ border: '1px dashed rgba(36,26,86,.2)', borderRadius: 16, padding: '30px 22px' }}>
            <div className="strong" style={{ fontSize: 14, marginBottom: 6 }}>Nothing matches that</div>
            <div className="small">Try “kitchen”, “wardrobe”, “movers” or clear the search.</div>
          </div>
        )}
      </div>
    </Screen>
  );
}
