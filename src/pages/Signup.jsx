import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// import { auth, createUserWithEmailAndPassword, createUserProfileDocument } from "../firebase/firebase";
import "./Signup.css";

export default function Signup() {
  const [state,setState] = useState({
    displayName: "",
    email: "",
    password: "",
    confirmPassword: ""
  })
  const navigate = useNavigate();
  const handleSignup = async (e) => {
    e.preventDefault();
    const { displayName, email, password, confirmPassword} = state;
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    // try {
    //   const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    //   const user = userCredential.user;
    //   await createUserProfileDocument(user, {displayName})
    //   navigate("/login");
    // } catch (error) {
    //   console.error("Error signing up:", error.message);
    // }
  };
  const handleChange = (e) => {
    const {name, value} = e.target;
    setState(prev => {
      return {...prev, [name]: value}
    })
  }
  const { displayName, email, password, confirmPassword} = state;
  return (
    <div className="signup-container">
      <div className="signup-box">
        <h2>Sign Up</h2>
        <form onSubmit={handleSignup}>
          <div className="input-group">
          <input
              type="text"
              name="displayName"
              placeholder="Name"
              value={displayName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="signup-btn">Sign Up</button>
        </form>
      </div>
    </div>
  );
}
