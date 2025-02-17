import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import { auth } from "./firebase";
import { signOut } from "firebase/auth";
import { doc, getDoc,arrayRemove,updateDoc  } from "firebase/firestore";
import { db} from "./firebase";
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import ProtectedRoute from "./ProtectRoute";
import Chat from "./pages/Chat";
import "./App.css";
import axios from "axios";

function App() {
  const [isMenuExpanded, setIsMenuExpanded] = useState(false);
  const [isFreqExpanded, setIsFreqExpanded] = useState(false);
  const [isHisExpanded, setIsHisExpanded] = useState(false);
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);
  const [chatHistories, setChatHistories] = useState({}); // Store chat histories by session ID
  const [sessionId, setSessionId] = useState(""); // Track the current session ID
  const [isModalOpenHis, setIsModalOpenHis] = useState(false); // pop-up for confirm delete the history
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const navigate = useNavigate();

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        const fetchUserName = async () => {
          const userDocRef = doc(db, "Users", user.uid);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            setUserName(userDocSnap.data().userName);
          }
        };
        fetchUserName();
      } else {
        setUser(null);
        setUserName("");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Fetch chat histories when "ประวัติการพูดคุย" is expanded
  useEffect(() => {
    if (isHisExpanded && user) {
      fetchChatHistories();
    }
  }, [isHisExpanded, user]);

  // Add this to your existing useEffect hooks
useEffect(() => {
  if (isModalOpenHis) {
    document.body.classList.add('modal-open');
  } else {
    document.body.classList.remove('modal-open');
  }
  
  return () => {
    document.body.classList.remove('modal-open');
  };
}, [isModalOpenHis]);

  // Fetch chat histories for all session IDs of the user
  const fetchChatHistories = async () => {
    try {
      const userDocRef = doc(db, "Users", user.uid);
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        const sessionIds = userDocSnap.data().sID || [];
        const histories = {};

        for (const sessionId of sessionIds) {
          const response = await axios.get("http://localhost:5000/api/chat-history", {
            params: { sessionId },
          });
          histories[sessionId] = response.data;
        }

        setChatHistories(histories);
      }
    } catch (error) {
      console.error("Error fetching chat histories:", error);
    }
  };
  const goToNewChat = () => {
    navigate("/"); // Navigate to the Home page
    setTimeout(() => {
      window.location.reload(); // Reload after navigating
    }, 1);
  }
  const openPopUptoDeleteHis = (sessionId) => {
    setSelectedSessionId(sessionId);
    setIsModalOpenHis(true)
  }

  const cancelPopUptoDeleteHis = () => {
    setIsModalOpenHis(false); // Close the modal
    setSelectedSessionId(null); 
    console.log('Session deletion canceled.');
  };

  const confirmDelete = async () => {
    if (selectedSessionId) {
      await handleSessionClickDel(selectedSessionId);
      setIsModalOpenHis(false);
      setSelectedSessionId(null);
    }
  };

  const handleDeleteSession = async (sessionId) => {
    try {
      // Make a DELETE request to delete the session
      const response = await axios.delete("http://localhost:5000/api/delete-session", {
        params: { sessionId },
      });
  
      // Notify the user about the success
      alert(response.data.message);
      const urlParams = new URLSearchParams(window.location.search);
      const sessionIdFromUrl = urlParams.get('sessionId');
      if( sessionId === sessionIdFromUrl){
        window.location.reload()
      }
      // Optionally, you can clear the chat history or update UI state
    } catch (error) {
      console.error("Error deleting session:", error);
      alert("An error occurred while deleting the session.");
    }
  };

  const removeSessionFromDB = async (sessionId) => {
    if (!auth.currentUser || !sessionId) return;
  
    try {
      const userRef = doc(db, "Users", auth.currentUser.uid);
      await updateDoc(userRef, {
        sID: arrayRemove(sessionId),
      });
      console.log("Session ID removed successfully!");
      fetchChatHistories();  
    } catch (error) {
      console.error("Error removing session ID:", error);
    }
  };

  // Handle click on a session button
  const handleSessionClick = (sessionId) => {
    setSessionId(sessionId); // Update the current session ID
    navigate(`/?sessionId=${sessionId}`); // Update the URL
  };

  const handleSessionClickDel = async (sessionId) => {
    if (!sessionId) return; // Check if sessionId is provided
  
    try {
      // Call the removeSessionFromDB function to remove the sessionId
      await removeSessionFromDB(sessionId);
      console.log("Session deleted from user account successfully!");
    } catch (error) {
      console.error("Error handling session in user delete:", error);
      alert("Failed to delete session from user account."); // Optional: Inform the user of failure
      return; // Exit the function if user session deletion fails
    }
  
    try {
      // Delete session from the database (PostgreSQL)
      await handleDeleteSession(sessionId);
      console.log("Session deleted from the database successfully!");
      // alert("Session deleted successfully."); 
    } catch (error) {
      console.error("Error handling session database delete:", error);
      alert("Failed to delete session from the database."); // Inform the user of failure
    }
  };
  

  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="App">
      {/* Navbar (Left Column) - Only show if user is logged in */}
      {user && (
        <nav className="navbar">
          <Link className="logo" to="/">
            Big Data
            <img src="/NT_Logo.png" alt="Mountain" width="60px" height="35px"/>
          </Link>
          <ul className="nav-links">
            {/* Home Button with Collapsible List */}

            <div className="container-new-chat" onClick={() => goToNewChat()}>
              <div className="new-chat-button"  >
              <svg xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="#000000" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="16"></line>
              <line x1="8" y1="12" x2="16" y2="12"></line>
              </svg>
              <h3>แชทใหม่</h3>
              </div>
              </div>
 
            <li>
              <div className="nav-item" onClick={() => setIsMenuExpanded(!isMenuExpanded)}>
                <span>เมนู</span>
                <span className="arrow">{isMenuExpanded ? "▲" : "▼"}</span>
              </div>
              {isMenuExpanded && (
                <ul className="sub-links">
                  <li>
                    <Link to="/subpage1">แนะนำข้อมูลเพิ่มเติม</Link>
                  </li>
                  <li>
                    <Link to="/subpage2">คำถามในการใช้งาน</Link>
                  </li>
                  <li>
                    <Link to="/subpage3">รายงานปัญหา</Link>
                  </li>
                  <li>
                    <Link to="/subpage4">ติดต่อแอดมิน</Link>
                  </li>
                </ul>
              )}
            </li>

            {/* <li>
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
            </li> */}
            <li>
              <div className="nav-item" onClick={() => setIsHisExpanded(!isHisExpanded)}>
                <span>ประวัติการสนทนา</span>
                <span className="arrow">{isHisExpanded ? "▲" : "▼"}</span>
              </div>
              {isHisExpanded && (
                <ul className="sub-links">
                  {Object.entries(chatHistories).map(([sessionId, history]) => (
                    <li key={sessionId}>
                      <button
                        className="session-button"
                        onClick={() => handleSessionClick(sessionId)}
                      >
                        {history.firstQuestion}
                      </button>
                      <button className="del-button"  onClick={() => openPopUptoDeleteHis(sessionId)}>
                      <svg xmlns="http://www.w3.org/2000/svg" 
                      width="20" 
                      height="20" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="#920F0FFF" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        <line x1="10" y1="11" x2="10" y2="17"></line>
                        <line x1="14" y1="11" x2="14" y2="17"></line>
                        </svg>
                        </button>
                    </li>
                  ))}
                </ul>
              )}
            </li>

            {/* Other Buttons */}
            {/* <li>
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
            </li> */}
          </ul>

          {/* Display User Email and Logout Button */}
          <div className="user-info">
            <p>{userName || user.email}</p>
            <button onClick={handleLogout}>Logout</button>
          </div>
        </nav>
      )}

      {/* Main Content Area (Right Column) */}
      <main className="main-content" style={{ marginLeft: user ? "250px" : "0" }}>

      {isModalOpenHis && (
        <>
          <div className="modal-overlay" onClick={(e) => e.stopPropagation()}>
            <div className="modal-container">
              <div className="modal-content">
                <h3>ต้องการลบประวัติการสนทนานี้หรือไม่?</h3>
                <div className="modal-buttons">
                  <button 
                    className="modal-button confirm-button" 
                    onClick={confirmDelete}
                  >
                    ยืนยัน
                  </button>
                  <button 
                    className="modal-button cancel-button" 
                    onClick={cancelPopUptoDeleteHis}
                  >
                    ยกเลิก
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}



        <Routes>
          {/* Login Page (Unprotected) */}
          <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home userName={userName} sessionId={sessionId} fetchChatHistories={fetchChatHistories} />
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
                <div>แนะนำข้อมูลเพิ่มเติม</div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/subpage2"
            element={
              <ProtectedRoute>
                <div>คำถามในการใช้งาน</div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/subpage3"
            element={
              <ProtectedRoute>
                <div>รายงานปัญหา</div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/subpage4"
            element={
              <ProtectedRoute>
                <div>ติดต่อแอดมิน</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;