import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="header">
      <div className="logo-title">
        <div className="logo">Logo</div>
        <h1 className="title">Task Manager</h1>
      </div>

      {/* Hamburger Menu Button */}
      <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </button>

      {/* Navigation Menu */}
      <nav className={`nav ${menuOpen ? 'open' : ''}`}>
        <ul className="nav-list">
          <li className="nav-item">
            <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Home</NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/today" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Today's</NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/upcoming" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Upcoming</NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/completed" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Completed</NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/settings" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Settings</NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/login" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Login</NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
