import { REVIEWS, TRUST } from '../data/content.js';
import Screen from '../components/Screen.jsx';
import BackButton from '../components/BackButton.jsx';

export default function Reviews() {
  return (
    <Screen>
      <div className="page">
        <BackButton />
        <h1 className="h1">Reviews &amp; trust</h1>
        <p className="lead">Designed for families and professionals who value time, predictability and a ready home.</p>
        <div className="grid-2 mb-20">
          <div className="row" style={{ gridColumn: '1 / -1', background: 'var(--pink)', borderRadius: 16, padding: '17px 18px', gap: 12, alignItems: 'baseline' }}>
            <div style={{ font: '600 26px/1 Poppins', color: '#fff' }}>4.9</div>
            <div style={{ font: '400 12px/1.4 Poppins', color: 'rgba(255,255,255,.85)' }}>average, verified handovers</div>
          </div>
          {TRUST.slice(0, 2).map((t) => <div key={t.k} className="stat"><b style={{ fontSize: 15 }}>{t.k}</b><span>{t.v}</span></div>)}
        </div>
        <div className="stack mb-20">
          {REVIEWS.map((r) => (
            <div key={r.i} className="card card-pad">
              <div className="stars">★★★★★</div>
              <p className="quote-text">{r.q}</p>
              <div className="row" style={{ gap: 9 }}>
                <span className="avatar">{r.i}</span>
                <span className="small" style={{ fontWeight: 500 }}>{r.m}</span>
              </div>
            </div>
          ))}
        </div>
        <img src="/assets/handover.png" alt="Simply Unpack handing over keys to a couple in a finished home" className="img-cover" style={{ height: 190, borderRadius: 18 }} />
      </div>
    </Screen>
  );
}
