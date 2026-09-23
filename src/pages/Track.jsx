import { useApp } from '../store/AppStore.jsx';
import { config, whatsappLink } from '../config.js';
import { liveMetrics } from '../lib/move.js';
import Screen from '../components/Screen.jsx';
import BackButton from '../components/BackButton.jsx';

export default function Track() {
  const { s, row, tick } = useApp();
  const live = liveMetrics(tick);

  return (
    <Screen>
      <div className="page">
        <BackButton to="/move" />
        <h1 className="h1">Live location</h1>
        <p className="lead">Truck 7 is on the way to your {row.label} in {s.area}.</p>
        {/* (MOCK) schematic route — swap for a maps SDK using VITE_MAPS_API_KEY and real GPS pings */}
        <div className="map mb-16" style={{ height: 280 }}>
          <div className="map-grid" />
          <div style={{ position: 'absolute', left: 40, right: 40, top: 56, bottom: 56, borderLeft: '2px dashed rgba(229,17,127,.35)', borderBottom: '2px dashed rgba(229,17,127,.35)', borderRadius: '0 0 0 18px' }} />
          <div className="row" style={{ position: 'absolute', left: 32, top: 48, gap: 8 }}>
            <span style={{ width: 11, height: 11, borderRadius: 999, background: 'var(--ink)' }} />
            <span style={{ font: '500 11px/1 Poppins' }}>{s.fromArea}</span>
          </div>
          <div className="row" style={{ position: 'absolute', right: 26, bottom: 44, gap: 8 }}>
            <span style={{ font: '500 11px/1 Poppins', color: 'var(--pink)' }}>{s.area}</span>
            <span style={{ width: 13, height: 13, borderRadius: 999, background: 'var(--pink)', boxShadow: '0 0 0 6px rgba(229,17,127,.18)' }} />
          </div>
          <div style={{ position: 'absolute', left: live.truckLeft, bottom: 48, transform: 'translateX(-50%)', transition: 'left .8s linear', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <div style={{ background: 'var(--ink)', color: 'var(--yellow)', borderRadius: 999, padding: '5px 10px', font: '600 10.5px/1 Poppins', whiteSpace: 'nowrap' }}>{live.etaLine}</div>
            <div style={{ width: 34, height: 22, borderRadius: 6, background: 'var(--pink)', boxShadow: '0 3px 10px rgba(36,26,86,.25)' }} />
          </div>
          <div className="map-caption">Route · schematic</div>
        </div>
        <div className="row mb-16" style={{ gap: 9, alignItems: 'stretch' }}>
          <div className="stat"><b>{live.eta}</b><span>minutes away</span></div>
          <div className="stat"><b>{live.crates}/48</b><span>crates loaded</span></div>
          <div className="stat"><b>4</b><span>crew on board</span></div>
        </div>
        <div className="card card-pad mb-12">
          <div className="row" style={{ gap: 12, marginBottom: 15 }}>
            <span className="avatar lg">LK</span>
            <div>
              <div className="strong" style={{ fontSize: 14.5 }}>Lakshmi K. · crew lead</div>
              <div className="small" style={{ fontSize: 11.5 }}>KA 01 · truck 7 · ID shared on arrival</div>
            </div>
          </div>
          <div className="row" style={{ gap: 9 }}>
            <a className="btn btn-pink btn-sm" href={`tel:${config.supportPhone}`}>Call crew</a>
            <a className="btn btn-outline btn-sm" href={whatsappLink('Hi, checking on truck 7 for SU-4827.')} target="_blank" rel="noreferrer">WhatsApp</a>
          </div>
        </div>
        <div className="cream" style={{ padding: '17px 19px' }}>
          <div className="strong" style={{ fontSize: 13.5, marginBottom: 9 }}>On arrival</div>
          <div className="small">Lift is booked 14:00–18:00 and parking is cleared. Crates are placed room-wise, then unpacking starts in the kitchen.</div>
        </div>
      </div>
    </Screen>
  );
}
