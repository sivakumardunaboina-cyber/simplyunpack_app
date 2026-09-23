import { useApp } from '../store/AppStore.jsx';

export default function Toast() {
  const { toast } = useApp();
  if (!toast) return null;
  return <div className="toast" role="status" aria-live="polite">{toast}</div>;
}
