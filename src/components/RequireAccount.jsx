import { Navigate, useLocation } from 'react-router-dom';
import { useApp } from '../store/AppStore.jsx';

export default function RequireAccount({ children }) {
  const { s } = useApp();
  const loc = useLocation();
  if (!s.account) return <Navigate to={`/auth/login?next=${encodeURIComponent(loc.pathname)}`} replace />;
  return children;
}
