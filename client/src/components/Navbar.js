import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const avatar = user?.avatar
    ? user.avatar
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'U')}&background=72383d&color=efe9e1&bold=true`;

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="nav-inner">
        <Link to="/" className="nav-brand" onClick={closeMenu}>
          <span className="brand-icon">{'</>'}</span>
          <span className="brand-text">DevBoard</span>
        </Link>

        <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <Link
            to="/"
            className={location.pathname === '/' ? 'nav-link active' : 'nav-link'}
            onClick={closeMenu}
          >
            Explore
          </Link>
          {user ? (
            <>
              <Link to="/write" className="nav-link" onClick={closeMenu}>Write</Link>
              <Link to="/dashboard" className="nav-link" onClick={closeMenu}>My Posts</Link>
              <Link to="/profile" className="nav-link profile-link" onClick={closeMenu}>
                <img src={avatar} alt={user.name} className="nav-avatar" />
                <span>{user.name.split(' ')[0]}</span>
              </Link>
              <button className="btn-outline-sm" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link" onClick={closeMenu}>Login</Link>
              <Link to="/register" className="btn-nav-cta" onClick={closeMenu}>
                Get Started
              </Link>
            </>
          )}
        </div>

        <button className="hamburger" onClick={() => setMenuOpen((o) => !o)} aria-label="Menu">
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;