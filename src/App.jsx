import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useApp } from './store/AppStore.jsx';
import Toast from './components/Toast.jsx';
import RequireAccount from './components/RequireAccount.jsx';
import Welcome from './pages/Welcome.jsx';
import Onboarding from './pages/Onboarding.jsx';
import Auth from './pages/Auth.jsx';
import Home from './pages/Home.jsx';
import Explore from './pages/Explore.jsx';
import ServiceDetail from './pages/ServiceDetail.jsx';
import Plan from './pages/Plan.jsx';
import Quote from './pages/Quote.jsx';
import Survey from './pages/Survey.jsx';
import SurveyBooked from './pages/SurveyBooked.jsx';
import Coverage from './pages/Coverage.jsx';
import Reviews from './pages/Reviews.jsx';
import Profile from './pages/Profile.jsx';
import Notifications from './pages/Notifications.jsx';
import Support from './pages/Support.jsx';
import MyMove from './pages/MyMove.jsx';
import Timeline from './pages/Timeline.jsx';
import Track from './pages/Track.jsx';
import FinalQuote from './pages/FinalQuote.jsx';
import PayAdvance from './pages/PayAdvance.jsx';
import Approvals from './pages/Approvals.jsx';
import Handover from './pages/Handover.jsx';
import Rate from './pages/Rate.jsx';
import Invoice from './pages/Invoice.jsx';
import Manage from './pages/Manage.jsx';

const PUBLIC_FIRST_RUN = /^\/(welcome|onboarding|auth)/;
const acct = (el) => <RequireAccount>{el}</RequireAccount>;

export default function App() {
  const { s } = useApp();
  const { pathname } = useLocation();

  if (!s.onboarded && !PUBLIC_FIRST_RUN.test(pathname)) return <Navigate to="/welcome" replace />;

  return (
    <div className="app-root">
      <div className="app-frame">
        <div className="route" key={pathname}>
          <Routes>
            <Route path="/welcome" element={<Welcome />} />
            <Route path="/onboarding/:step" element={<Onboarding />} />
            <Route path="/auth/:mode" element={<Auth />} />
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/services/:id" element={<ServiceDetail />} />
            <Route path="/plan" element={<Plan />} />
            <Route path="/quote" element={<Quote />} />
            <Route path="/survey" element={<Survey />} />
            <Route path="/survey/booked" element={<SurveyBooked />} />
            <Route path="/coverage" element={<Coverage />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/support" element={<Support />} />
            <Route path="/move" element={acct(<MyMove />)} />
            <Route path="/move/timeline" element={acct(<Timeline />)} />
            <Route path="/move/track" element={acct(<Track />)} />
            <Route path="/move/quote" element={acct(<FinalQuote />)} />
            <Route path="/move/pay" element={acct(<PayAdvance />)} />
            <Route path="/move/approvals" element={acct(<Approvals />)} />
            <Route path="/move/handover" element={acct(<Handover />)} />
            <Route path="/move/rate" element={acct(<Rate />)} />
            <Route path="/move/invoice" element={acct(<Invoice />)} />
            <Route path="/move/manage" element={acct(<Manage />)} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
        <Toast />
      </div>
    </div>
  );
}
