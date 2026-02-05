import { Outlet, NavLink } from 'react-router-dom';
import { CozyBackground } from './CozyBackground';
import './Layout.css';

export function Layout() {
  return (
    <div className="layout">
      <CozyBackground />
      <header className="header">
        <div className="header-content">
          <NavLink to="/" className="logo">
            <span className="logo-icon">🌱</span>
            <span className="logo-text">Tended</span>
          </NavLink>
          <nav className="nav">
            <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} end>
              Home
            </NavLink>
            <NavLink to="/friends" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              Garden
            </NavLink>
          </nav>
        </div>
      </header>
      <main className="main">
        <div className="main-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
