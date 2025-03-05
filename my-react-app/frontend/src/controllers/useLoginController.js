// Login.js
import React, { useState, useEffect } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import "../css/Login.css"; // Import the CSS file for the login page

export const useLoginController = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Redirect authenticated users to the home page
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        navigate("/"); // Redirect to home page if user is already logged in
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/"); // Redirect to home page after successful login
    } catch (err) {
      setError(`ชื่อผู้ใช้หรือรหัสผิดพลาด`); // Display error message with err.message
    }
  };

  return {
    email, 
    setEmail,
    password, 
    setPassword,
    error, 
    setError,
    handleLogin
  };
}