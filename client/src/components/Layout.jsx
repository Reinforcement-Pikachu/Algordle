import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/layout.css';
import { useTheme } from '../styles/ThemeContext.js'; // Import the context

function Layout({ user, children, isDarkMode, toggleTheme, setUser }) {
  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    setUser(null);
  };

  return (
    <div className={`layout ${isDarkMode ? 'dark' : ''}`}>
      {/* Navbar */}
      <nav className='navbar'>
        <h2 className='logo'>Algordle</h2>
        <div className='nav-right'>
          <ul className='nav-links'>
            <li>
              <Link to='/profile'>Profile</Link>
            </li>
            <li>
              <Link to='/settings'>Settings</Link>
            </li>
          </ul>
          <div className='nav-actions'>
            {user && (
              <button className='logout-btn' onClick={handleLogout}>
                Logout
              </button>
            )}
            <button className='theme-toggle' onClick={toggleTheme}>
              {isDarkMode ? '☀ Light Mode' : '🌙 Dark Mode'}
            </button>
          </div>
        </div>
      </nav>

      <main className='content'>{children}</main>
    </div>
  );
}

export default Layout;
