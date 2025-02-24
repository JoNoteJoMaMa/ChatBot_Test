import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import ProtectedRoute from "./ProtectRoute";
import Chat from "./pages/Chat";
import "./css/App.css";
import { agents } from "./agents";
import { useAppController } from "./controllers/useAppController";

function App() {
  const {
    isMenuExpanded,
    setIsMenuExpanded,
    isFreqExpanded,
    setIsFreqExpanded,
    isHisExpanded,
    setIsHisExpanded,
    user,
    userName,
    loading,
    chatHistories,
    sessionId,
    isModalOpenHis,
    isModalOpenHisDelAlert,
    setIsModalOpenHisDelAlert,
    selectAgent,
    setSelectedAgent,
    goToNewChat,
    openPopUptoDeleteHis,
    cancelPopUptoDeleteHis,
    confirmDelete,
    handleSessionClick,
    chooseAgent,
    handleLogout,
    fetchChatHistories,
    handleFinishedDel
  } = useAppController();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="App">
      {user && (
        <nav className="navbar">
          <Link className="logo" to="/">
            Big Data
            <img src="/NT_Logo.png" alt="Mountain" width="60px" height="35px"/>
          </Link>
          <ul className="nav-links">
            <li>
              <div className="container-new-chat" onClick={goToNewChat}>
                <div className="new-chat-button">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="16"></line>
                    <line x1="8" y1="12" x2="16" y2="12"></line>
                  </svg>
                  <h3>แชทใหม่</h3>
                </div>
              </div>
              <li>
                <div className="nav-item" onClick={() => { setIsFreqExpanded(!isFreqExpanded); setIsMenuExpanded(false); setIsHisExpanded(false); }}>
                  <span>{selectAgent === "" ? "เลือก Agent" : selectAgent}</span>
                  <span className="arrow">{isFreqExpanded ? "▲" : "▼"}</span>
                </div>
                {isFreqExpanded && (
                  <ul className="sub-links">
                    {agents.map((agent, index) => (
                      <li className="agentButton" key={index} onClick={() => chooseAgent(agent)}>
                        {agent}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
              <li>
                <div className="nav-item" onClick={() => { setIsMenuExpanded(!isMenuExpanded); setIsHisExpanded(false); setIsFreqExpanded(false); }}>
                  <span>เมนู</span>
                  <span className="arrow">{isMenuExpanded ? "▲" : "▼"}</span>
                </div>
                {isMenuExpanded && (
                  <ul className="sub-links">
                    <li><Link to="/subpage1">แนะนำข้อมูลเพิ่มเติม</Link></li>
                    <li><Link to="/subpage2">คำถามในการใช้งาน</Link></li>
                    <li><Link to="/subpage3">รายงานปัญหา</Link></li>
                    <li><Link to="/subpage4">ติดต่อแอดมิน</Link></li>
                  </ul>
                )}
              </li>
              <div className="nav-item" onClick={() => { setIsHisExpanded(!isHisExpanded); setIsMenuExpanded(false); setIsFreqExpanded(false); }}>
                <span>ประวัติการสนทนา</span>
                <span className="arrow">{isHisExpanded ? "▲" : "▼"}</span>
              </div>
              {isHisExpanded && (
                <ul className="sub-links">
                  {Object.entries(chatHistories).map(([sessionId, history]) => (
                    <li key={sessionId}>
                      <button className="session-button" onClick={() => handleSessionClick(sessionId)}>
                        {history.firstQuestion}
                      </button>
                      <button className="del-button" onClick={() => openPopUptoDeleteHis(sessionId)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#920F0FFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
          </ul>
          <div className="user-info">
            <p>{userName || user.email}</p>
            <button onClick={handleLogout}>Logout</button>
          </div>
        </nav>
      )}
      <main className="main-content" style={{ marginLeft: user ? "250px" : "0" }}>
        {isModalOpenHis && (
          <div className="modal-overlay" onClick={(e) => e.stopPropagation()}>
            <div className="modal-container">
              <div className="modal-content">
                <h3>ต้องการลบประวัติการสนทนานี้หรือไม่?</h3>
                <div className="modal-buttons">
                  <button className="modal-button confirm-button" onClick={confirmDelete}>ยืนยัน</button>
                  <button className="modal-button cancel-button" onClick={cancelPopUptoDeleteHis}>ยกเลิก</button>
                </div>
              </div>
            </div>
          </div>
        )}
         {isModalOpenHisDelAlert && (
          <div className="modal-overlay" >
            <div className="modal-container">
              <div className="modal-content">
                <h3>ทำการลบประวัติการสนทนาดังกล่าวเรียบร้อย</h3>
                <div className="modal-buttons">
                  <button className="modal-button confirm-button" onClick={() => handleFinishedDel(sessionId)}>ยืนยัน</button>
                </div>
              </div>
            </div>
          </div>
        )}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute><Home userName={userName} sessionId={sessionId} selectAgent={selectAgent} setSelectedAgent={setSelectedAgent} fetchChatHistories={fetchChatHistories}/></ProtectedRoute>} />
          <Route path="/welcome" element={<ProtectedRoute><div>กรุณาเลือก Agent ที่คุณต้องการจะคุยด้วย</div></ProtectedRoute>} />
          <Route path="/about" element={<ProtectedRoute><About /></ProtectedRoute>} />
          <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
          <Route path="/services" element={<ProtectedRoute><Services /></ProtectedRoute>} />
          <Route path="/contact" element={<ProtectedRoute><Contact /></ProtectedRoute>} />
          <Route path="/subpage1" element={<ProtectedRoute><div>แนะนำข้อมูลเพิ่มเติม</div></ProtectedRoute>} />
          <Route path="/subpage2" element={<ProtectedRoute><div>คำถามในการใช้งาน</div></ProtectedRoute>} />
          <Route path="/subpage3" element={<ProtectedRoute><div>รายงานปัญหา</div></ProtectedRoute>} />
          <Route path="/subpage4" element={<ProtectedRoute><div>ติดต่อแอดมิน</div></ProtectedRoute>} />
        </Routes>
      </main>
    </div>
  );
}

export default App;