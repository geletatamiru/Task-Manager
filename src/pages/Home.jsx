import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import './Home.css';
import taskImage from '../assets/task.png'; // Make sure to add an image in your assets folder

const Home = () => {
  const user = useSelector(state => state.user.user);
  return (
    <div className="home-container">
      <div className="text-section">
        <h1 className="app-title">Stay Organized & Boost Productivity</h1>
        <p className="app-description">
          MyTaskManager helps you manage daily tasks effortlessly. Plan, prioritize, and track your progress with ease.
        </p>
        <p className="cta-text">
          <Link to={user ? "/today" : "/login"} className="cta-button">Get Started</Link>
        </p>
      </div>
      <div className="image-section">
        <img src={taskImage} alt="Task Management" className="task-image" />
      </div>
    </div>
  );
};

export default Home;
