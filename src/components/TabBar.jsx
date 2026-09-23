import { useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../store/AppStore.jsx';
import { IconHome, IconSearch, IconBox, IconTruck, IconUser } from './Icons.jsx';

export default function TabBar() {
  const { pathname } = useLocation();
  const nav = useNavigate();
  const { s } = useApp();
  const tabs = [
    { to: '/', label: 'Home', Icon: IconHome, active: pathname === '/' },
    { to: '/explore', label: 'Explore', Icon: IconSearch, active: pathname.startsWith('/explore') },
    s.account
      ? { to: '/move', label: 'Your move', Icon: IconTruck, active: pathname.startsWith('/move') }
      : { to: '/plan', label: 'Your plan', Icon: IconBox, active: pathname.startsWith('/plan') },
    { to: '/profile', label: 'You', Icon: IconUser, active: pathname.startsWith('/profile') },
  ];
  return (
    <nav className="tabbar" aria-label="Main">
      {tabs.map(({ to, label, Icon, active }) => (
        <button key={label} type="button" className={`tab${active ? ' is-active' : ''}`} onClick={() => nav(to)} aria-current={active ? 'page' : undefined}>
          <Icon />
          <span>{label}</span>
        </button>
      ))}
    </nav>
  );
}
