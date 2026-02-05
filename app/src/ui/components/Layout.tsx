import { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { useFriendStore } from '../../core/stores/friendStore';
import { CozyBackground } from './CozyBackground';
import './Layout.css';

export function Layout() {
  const [showGardenMenu, setShowGardenMenu] = useState(false);
  const [showNewGarden, setShowNewGarden] = useState(false);
  const [newGardenName, setNewGardenName] = useState('');

  const gardens = useFriendStore((state) => state.gardens);
  const currentGardenId = useFriendStore((state) => state.currentGardenId);
  const switchGarden = useFriendStore((state) => state.switchGarden);
  const createGarden = useFriendStore((state) => state.createGarden);

  const currentGarden = gardens.find((g) => g.id === currentGardenId);

  const handleCreateGarden = () => {
    if (newGardenName.trim()) {
      const garden = createGarden(newGardenName.trim());
      switchGarden(garden.id);
      setNewGardenName('');
      setShowNewGarden(false);
      setShowGardenMenu(false);
    }
  };

  return (
    <div className="layout">
      <CozyBackground />
      <header className="header">
        <div className="header-content">
          <NavLink to="/" className="logo">
            <span className="logo-icon">🌱</span>
            <span className="logo-text">Tended</span>
          </NavLink>

          {/* Garden selector */}
          <div className="garden-selector">
            <button
              className="garden-selector-btn"
              onClick={() => setShowGardenMenu(!showGardenMenu)}
            >
              <span className="garden-icon">{currentGarden?.icon || '🏠'}</span>
              <span className="garden-name">{currentGarden?.name || 'Select garden'}</span>
              <span className="dropdown-arrow">▾</span>
            </button>

            {showGardenMenu && (
              <div className="garden-menu">
                {gardens.map((garden) => (
                  <button
                    key={garden.id}
                    className={`garden-menu-item ${garden.id === currentGardenId ? 'active' : ''}`}
                    onClick={() => {
                      switchGarden(garden.id);
                      setShowGardenMenu(false);
                    }}
                  >
                    <span className="garden-icon">{garden.icon}</span>
                    <span>{garden.name}</span>
                    {garden.isDemo && <span className="demo-badge">Demo</span>}
                  </button>
                ))}

                {showNewGarden ? (
                  <div className="new-garden-form">
                    <input
                      type="text"
                      placeholder="Garden name..."
                      value={newGardenName}
                      onChange={(e) => setNewGardenName(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleCreateGarden()}
                      autoFocus
                    />
                    <button className="btn-sm" onClick={handleCreateGarden}>Add</button>
                  </div>
                ) : (
                  <button
                    className="garden-menu-item new-garden"
                    onClick={() => setShowNewGarden(true)}
                  >
                    <span className="garden-icon">+</span>
                    <span>New garden...</span>
                  </button>
                )}
              </div>
            )}
          </div>

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
