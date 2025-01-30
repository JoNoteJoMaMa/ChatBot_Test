import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import ProtectedRoute from "./ProtectRoute";
import "./App.css";

function App() {
  const [isMenuExpanded, setIsMenuExpanded] = useState(false); // State to manage Home button expansion
  const [isFreqExpanded, setIsFreqExpanded] = useState(false); // State to manage Home button expansion

  const toggleMenuList = () => {
    setIsMenuExpanded(!isMenuExpanded); // Toggle the state
  };

  const toggleFreqList = () => {
    setIsFreqExpanded(!isFreqExpanded); // Toggle the state
  };

  return (
    <Router>
      <div className="App">
        {/* Navbar (Left Column) */}
        <nav className="navbar">
          <Link className="logo" to="/">
            Chat Bot
          </Link>
          <ul className="nav-links">
            {/* Home Button with Collapsible List */}
            <li>
              <div className="nav-item" onClick={toggleMenuList}>
                <span>เมนู</span>
                <span className="arrow">{isMenuExpanded ? "▲" : "▼"}</span>
              </div>
              {isMenuExpanded && (
                <ul className="sub-links">
                  <li>
                    <Link to="/subpage1">Subpage 1</Link>
                  </li>
                  <li>
                    <Link to="/subpage2">Subpage 2</Link>
                  </li>
                </ul>
              )}
            </li>

            <li>
              <div className="nav-item" onClick={toggleFreqList}>
                <span>คำถามที่ Chat พบบ่อย</span>
                <span className="arrow">{isFreqExpanded ? "▲" : "▼"}</span>
              </div>
              {isFreqExpanded && (
                <ul className="sub-links">
                  <li>
                    <Link to="/subpage1">Subpage 1</Link>
                  </li>
                  <li>
                    <Link to="/subpage2">Subpage 2</Link>
                  </li>
                </ul>
              )}
            </li>

            {/* Other Buttons */}
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/services">Services</Link>
            </li>
            <li>
              <Link to="/contact">Contact</Link>
            </li>
          </ul>
        </nav>

        {/* Main Content Area (Right Column) */}
        <main className="main-content">
          <Routes>
            {/* Login Page (Unprotected) */}
            <Route path="/login" element={<Login />} />

            {/* Protected Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/about"
              element={
                <ProtectedRoute>
                  <About />
                </ProtectedRoute>
              }
            />
            <Route
              path="/services"
              element={
                <ProtectedRoute>
                  <Services />
                </ProtectedRoute>
              }
            />
            <Route
              path="/contact"
              element={
                <ProtectedRoute>
                  <Contact />
                </ProtectedRoute>
              }
            />

            {/* Subpages (Protected) */}
            <Route
              path="/subpage1"
              element={
                <ProtectedRoute>
                  <div>Subpage 1 Content</div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/subpage2"
              element={
                <ProtectedRoute>
                  <div>Subpage 2 Content</div>
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;