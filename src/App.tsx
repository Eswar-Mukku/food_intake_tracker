import { useState, useEffect } from 'react';
import type { User, FoodLog } from './types/index';
import { getCurrentUser, clearCurrentUser } from './utils/storage';
import { Auth } from './components/Auth';
import { Dashboard } from './components/Dashboard';
import { FoodDiary } from './components/FoodDiary';
import { Activity } from './components/Activity';
import { Profile } from './components/Profile';
import { AIChat } from './components/AIChat';
import { NutritionDetail } from './components/NutritionDetail';
import './index.css';

type Page = 'dashboard' | 'diary' | 'activity' | 'profile' | 'nutrition';

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    clearCurrentUser();
    setCurrentUser(null);
    setCurrentPage('dashboard');
  };

  const handleUserUpdate = (updatedUser: User) => {
    setCurrentUser(updatedUser);
  };

  if (!currentUser) {
    return <Auth onLogin={handleLogin} />;
  }

  const navItems: { page: Page; icon: string; label: string }[] = [
    { page: 'dashboard', icon: '📊', label: 'Dashboard' },
    { page: 'diary', icon: '📖', label: 'Food Diary' },
    { page: 'activity', icon: '💧', label: 'Activity' },
    { page: 'profile', icon: '👤', label: 'Profile' },
  ];

  return (
    <div className="app">
      {/* Mobile Menu Toggle */}
      <button className="mobile-menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? '✕' : '☰'}
      </button>

      {/* Sidebar Navigation */}
      <nav className={`sidebar ${menuOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="app-logo">
            <span className="app-logo-icon">🥗</span>
            <span className="app-logo-text">Food Tracker</span>
          </div>
        </div>

        <div className="sidebar-nav">
          {navItems.map(({ page, icon, label }) => (
            <button
              key={page}
              className={`nav-item ${currentPage === page ? 'active' : ''}`}
              onClick={() => {
                setCurrentPage(page);
                setMenuOpen(false);
              }}
            >
              <span className="nav-icon">{icon}</span>
              <span className="nav-label">{label}</span>
            </button>
          ))}
        </div>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">{currentUser.name.charAt(0).toUpperCase()}</div>
            <div className="user-details">
              <div className="user-name">{currentUser.name}</div>
              <div className="user-email">{currentUser.email}</div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        {currentPage === 'dashboard' && (
          <Dashboard
            user={currentUser}
            onNavigate={(page: any) => setCurrentPage(page as Page)}
          />
        )}
        {currentPage === 'diary' && <FoodDiary user={currentUser} />}
        {currentPage === 'activity' && <Activity user={currentUser} onUserUpdate={handleUserUpdate} />}
        {currentPage === 'profile' && (
          <Profile
            user={currentUser}
            onUserUpdate={handleUserUpdate}
            onLogout={handleLogout}
          />
        )}
        {currentPage === 'nutrition' && (
          <NutritionDetail
            user={currentUser}
            onUserUpdate={handleUserUpdate}
            onBack={() => setCurrentPage('dashboard')}
          />
        )}
      </main>

      {/* Mobile Overlay */}
      {menuOpen && <div className="mobile-overlay" onClick={() => setMenuOpen(false)}></div>}

      {/* AI Assistant */}
      <AIChat user={currentUser} onDataUpdate={(_log: FoodLog) => {
        const updated = getCurrentUser();
        if (updated) setCurrentUser(updated);
        // Force a global data refresh event
        window.dispatchEvent(new CustomEvent('dataUpdated'));
      }} />

      <style>{`
        .app {
          display: flex;
          min-height: 100vh;
          background: var(--bg-deep);
        }

        .mobile-menu-toggle {
          display: none;
          position: fixed;
          top: 1rem;
          left: 1rem;
          z-index: 1001;
          width: 3.5rem;
          height: 3.5rem;
          border-radius: var(--radius-lg);
          background: var(--bg-card);
          backdrop-filter: blur(10px);
          border: 1px solid var(--glass-border);
          color: white;
          box-shadow: 0 8px 32px rgba(0,0,0,0.3);
          font-size: 1.5rem;
          cursor: pointer;
        }

        .sidebar {
          width: 280px;
          background: rgba(15, 23, 42, 0.9);
          border-right: 1px solid var(--glass-border);
          backdrop-filter: blur(20px);
          display: flex;
          flex-direction: column;
          position: fixed;
          left: 0;
          top: 0;
          bottom: 0;
          z-index: 1000;
          transition: transform 0.3s ease;
        }

        .sidebar-header {
          padding: 2.5rem 1.5rem;
        }

        .app-logo {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .app-logo-icon {
          font-size: 2.2rem;
          filter: drop-shadow(0 0 8px var(--glow-primary));
        }

        .app-logo-text {
          font-size: 1.4rem;
          font-weight: 800;
          letter-spacing: -0.03em;
          background: linear-gradient(135deg, var(--primary-400), var(--primary-600));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .sidebar-nav {
          flex: 1;
          padding: 1.5rem 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          padding: 1.25rem 1.5rem;
          border: none;
          background: transparent;
          border-radius: var(--radius-lg);
          cursor: pointer;
          transition: all 0.2s;
          color: var(--text-secondary);
          font-size: 1rem;
          font-weight: 600;
        }

        .nav-item:hover {
          background: rgba(255, 255, 255, 0.05);
          color: var(--text-primary);
        }

        .nav-item.active {
          background: rgba(16, 185, 129, 0.15);
          color: var(--primary-400);
          border: 1px solid rgba(16, 185, 129, 0.2);
        }

        .sidebar-footer {
          padding: 1.5rem;
          border-top: 1px solid var(--glass-border);
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: rgba(255, 255, 255, 0.03);
          border-radius: var(--radius-xl);
          border: 1px solid var(--glass-border);
        }

        .user-avatar {
          width: 3rem;
          height: 3rem;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--primary-500), var(--primary-600));
          box-shadow: 0 4px 12px var(--glow-primary);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 1.25rem;
        }

        .user-name {
          font-weight: 700;
          font-size: 0.95rem;
          color: var(--text-primary);
        }

        .user-email {
          font-size: 0.8rem;
          color: var(--text-tertiary);
          max-width: 140px;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .main-content {
          flex: 1;
          margin-left: 280px;
          padding: 2rem;
          background: var(--bg-deep);
        }

        @media (max-width: 768px) {
          .main-content { margin-left: 0; padding: 1.5rem; padding-top: 6rem; }
          .sidebar { transform: translateX(-100%); width: 280px; }
          .sidebar.open { transform: translateX(0); }
          .mobile-menu-toggle { display: flex; }
          .mobile-overlay {
            display: block;
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.6);
            backdrop-filter: blur(8px);
            z-index: 999;
          }
        }
      `}</style>
    </div>
  );
}

export default App;
