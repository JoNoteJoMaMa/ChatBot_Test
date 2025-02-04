import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { auth } from "./firebase"; // Import Firebase auth
import { signOut } from "firebase/auth"; // Import signOut function
import { doc, getDoc } from "firebase/firestore"; // Import Firestore functions
import { db } from "./firebase"; // Import Firestore db reference
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import ProtectedRoute from "./ProtectRoute";
import Chat from "./pages/Chat";
import "./App.css";

function App() {
  const [isMenuExpanded, setIsMenuExpanded] = useState(false); // State to manage Home button expansion
  const [isFreqExpanded, setIsFreqExpanded] = useState(false); // State to manage Home button expansion
  const [user, setUser] = useState(null); // State to store the current user
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true); // State to track Firebase initialization

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user); // Set the user if logged in
        const fetchUserName = async () => {
          const userDocRef = doc(db, "Users", user.uid); // Fetch user data using user.uid
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            setUserName(userDocSnap.data().userName); // Set the userName if it exists
          }
        };
        fetchUserName();
      } else {
        setUser(null); // Clear the user if logged out
        setUserName(""); // Reset userName
      }
      setLoading(false); // Firebase initialization is complete
    });

    return () => unsubscribe(); // Cleanup subscription
  }, []);

  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut(auth); // Sign out the user
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Show a loading spinner while Firebase initializes
  if (loading) {
    return <div>Loading...</div>; // Replace this with a proper loading spinner
  }

  return (
    <Router>
      <div className="App">
        {/* Navbar (Left Column) - Only show if user is logged in */}
        {user && (
          <nav className="navbar">
            <Link className="logo" to="/">
              Chat Bot
            </Link>
            <ul className="nav-links">
              {/* Home Button with Collapsible List */}
              <li>
                <div className="nav-item" onClick={() => setIsMenuExpanded(!isMenuExpanded)}>
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
                <div className="nav-item" onClick={() => setIsFreqExpanded(!isFreqExpanded)}>
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
              <li>
                <Link to="/chat">Chat</Link>
              </li>
            </ul>

            {/* Display User Email and Logout Button */}
            <div className="user-info">
            <p>{userName || user.email}</p> {/* Display userName if available, otherwise display email */}
              <button onClick={handleLogout}>Logout</button> {/* Logout button */}
            </div>
          </nav>
        )}

        {/* Main Content Area (Right Column) */}
        <main className="main-content" style={{ marginLeft: user ? "250px" : "0" }} // Adjust margin-left based on user state
        >
          
          <Routes>
            {/* Login Page (Unprotected) */}
            <Route path="/login" element={<Login />} />

            {/* Protected Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Home userName={userName} /> {/* Pass userName as a prop */}
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
              path="/chat"
              element={
                <ProtectedRoute>
                  <Chat />
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