import { Link, NavLink, useLocation } from 'react-router';
import { useSavedStore } from '../store/useSavedStore';
import { Icon, type IconName } from './Icon';
export function Navbar() {
  const count = useSavedStore(s => s.savedIds.length);
  const {
    pathname
  } = useLocation();
  const links: {
    to: string;
    label: string;
    icon: IconName;
  }[] = [{
    to: '/',
    label: 'Explore',
    icon: 'home'
  }, {
    to: '/saved',
    label: 'Saved',
    icon: 'bookmark'
  }, {
    to: '/report',
    label: 'Report',
    icon: 'report'
  }, {
    to: '/about',
    label: 'About',
    icon: 'info'
  }];
  return <header className="site-header">
    <div className="header-inner">
      <Link to="/" className="brand" aria-label="FindIt home">
        <svg className="brand-logo" viewBox="0 0 48 54" aria-hidden="true">
          <defs>
            <linearGradient id="cube-top" x2="1" y2="1">
              <stop stopColor="#979bff" />
              <stop offset="1" stopColor="#646cff" />
            </linearGradient>
            <linearGradient id="cube-left" x2="1" y2="1">
              <stop stopColor="#b5d7ff" />
              <stop offset="1" stopColor="#7ba2ff" />
            </linearGradient>
            <linearGradient id="cube-right" x2="1" y2="1">
              <stop stopColor="#858cff" />
              <stop offset="1" stopColor="#545cff" />
            </linearGradient>
          </defs>
          <path d="M24 2 46 14 24 27 2 14Z" fill="url(#cube-top)" />
          <path d="M2 16 23 29v23L2 40Z" fill="url(#cube-left)" />
          <path d="m26 29 20-13v24L26 52Z" fill="url(#cube-right)" />
        </svg>
        <div>
          <div className="brand-name">Find<span>It</span></div>
          <div className="brand-tagline">Smart Lost &amp; Found Hub</div>
        </div>
      </Link>
      <nav className="main-nav" aria-label="Main navigation">
        {links.map(l => <NavLink key={l.to} to={l.to} end={l.to === '/'} className={({
          isActive
        }) => 'nav-link' + (isActive || l.to === '/' && pathname.startsWith('/items/') ? ' active' : '')}>
          <Icon name={l.icon} />
          <span>
            {l.label}
          </span>
          {l.to === '/saved' && count > 0 && <span className="nav-count">
            {count}
          </span>}
        </NavLink>)}
      </nav>
    </div>
  </header>;
}
