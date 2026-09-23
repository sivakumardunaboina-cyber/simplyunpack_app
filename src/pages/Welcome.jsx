import { useNavigate } from 'react-router-dom';
import { useApp } from '../store/AppStore.jsx';

export default function Welcome() {
  const nav = useNavigate();
  const { set } = useApp();
  const skip = () => { set({ onboarded: true }); nav('/'); };

  return (
    <main className="screen onboard">
      <div className="onboard-top">
        <span className="onboard-step">Welcome</span>
        <button type="button" className="back-btn light" onClick={skip}>Skip</button>
      </div>
      <div className="onboard-body">
        <div className="onboard-img">
          <img src="/assets/team-crates.png" alt="Simply Unpack crew with branded crates and boxes" className="img-cover" style={{ height: 214 }} />
        </div>
        <h1 className="onboard-title" style={{ fontSize: 30, lineHeight: 1.15, marginTop: 26, marginBottom: 12 }}>You move.<br />We make it home.</h1>
        <p className="onboard-lead">Pre-packing, packing &amp; moving, unpacking and complete home setup in Bengaluru. Create your profile in a minute, tell us about the move, and see your price straight away.</p>
        <div className="onboard-tagline">A simpler move · a brighter tomorrow</div>
      </div>
      <div className="bottom-actions">
        <button type="button" className="btn btn-yellow" onClick={() => nav('/auth/signup?from=onboarding')}>Create my profile</button>
        <button type="button" className="btn btn-outline-light" onClick={() => nav('/auth/login?from=onboarding')}>I have an account · Log in</button>
        <button type="button" className="btn-link light" onClick={() => nav('/onboarding/1')}>Explore as a guest</button>
      </div>
    </main>
  );
}
