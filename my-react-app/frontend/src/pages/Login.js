// Login.js
import React, { useState, useEffect } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import "../css/Login.css"; // Import the CSS file for the login page
import { useLoginController } from "../controllers/useLoginController";

function Login() {
  const {  email, 
  setEmail,
  password, 
  setPassword,
  error, 
  handleLogin
} = useLoginController();


  return (
    <div className="login-page"> {/* Add a class for the login page */}
      <div className="login-container">
        <h1>Chat Bot</h1>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}

export default Login;