import { useApp } from '../store/AppStore.jsx';
import { AREAS } from '../data/content.js';
import Screen from '../components/Screen.jsx';
import BackButton from '../components/BackButton.jsx';
import Chip from '../components/Chip.jsx';

export default function Coverage() {
  const { s, set } = useApp();
  return (
    <Screen>
      <div className="page">
        <BackButton />
        <h1 className="h1">Where we work</h1>
        <p className="lead">All of Bengaluru, with same-week crews in these localities.</p>
        {/* (MOCK) schematic — replace with a real map using VITE_MAPS_API_KEY */}
        <div className="map mb-20" style={{ height: 214 }}>
          <div className="map-grid" />
          <div style={{ position: 'absolute', left: '50%', top: '50%', width: 150, height: 150, transform: 'translate(-50%,-50%)', borderRadius: 999, background: 'rgba(229,17,127,.1)', border: '1.5px dashed rgba(229,17,127,.5)' }} />
          <div style={{ position: 'absolute', left: '50%', top: '50%', width: 13, height: 13, transform: 'translate(-50%,-50%)', borderRadius: 999, background: 'var(--pink)', boxShadow: '0 0 0 6px rgba(229,17,127,.2)' }} />
          <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,24px)', font: '600 11px/1 Poppins', whiteSpace: 'nowrap' }}>{s.area}</div>
          <div className="map-caption">Service radius · schematic</div>
        </div>
        <div className="chips mb-24">
          {AREAS.map((a) => <Chip key={a} small selected={s.area === a} onClick={() => set({ area: a })}>{a}</Chip>)}
        </div>
        <div className="cream" style={{ padding: '18px 20px' }}>
          <div className="strong" style={{ fontSize: 13.5, marginBottom: 7 }}>Moving in from another city?</div>
          <div className="small">We handle both halves within Bengaluru — packing and moving at your current home, then unpacking and setup at the new one. Distance and inventory are confirmed at the free survey.</div>
        </div>
      </div>
    </Screen>
  );
}
