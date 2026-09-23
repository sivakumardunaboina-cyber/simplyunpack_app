import { useNavigate } from 'react-router-dom';
import { useApp } from '../store/AppStore.jsx';
import { unreadCount } from '../lib/move.js';
import { IconBell } from './Icons.jsx';

export default function BellButton() {
  const nav = useNavigate();
  const { s } = useApp();
  const n = unreadCount(s);
  return (
    <button type="button" className="icon-btn" onClick={() => nav('/notifications')} aria-label={`Notifications${n ? `, ${n} unread` : ''}`}>
      <IconBell />
      {n > 0 ? <span className="badge">{n}</span> : null}
    </button>
  );
}
