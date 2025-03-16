import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import { logout } from '../state/userSlice';
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";
import './Header.css';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const user = useSelector(state => state.user.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      dispatch(logout());
      navigate("/login"); // Redirect to login after logout
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

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
            {user ? (
              <NavLink to="/today" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Today's</NavLink>
            ) : (
              <span className="nav-link disabled">Today's</span>
            )}
          </li>
          <li className="nav-item">
            {user ? (
              <NavLink to="/upcoming" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Upcoming</NavLink>
            ) : (
              <span className="nav-link disabled">Upcoming</span>
            )}
          </li>
          <li className="nav-item">
            {user ? (
              <NavLink to="/completed" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Completed</NavLink>
            ) : (
              <span className="nav-link disabled">Completed</span>
            )}
          </li>
          <li className="nav-item">
            {user ? (
              <NavLink to="/settings" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Settings</NavLink>
            ) : (
              <span className="nav-link disabled">Settings</span>
            )}
          </li>
          <li className="nav-item">
            {user ? (
              <button onClick={handleLogout} className="nav-link logout">Logout</button>
            ) : (
              <NavLink to="/login" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Login</NavLink>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
