import React from "react";
import { recommendedQuestions } from "../RecommendedQuestions";
import "../css/Home.css";
import { agents } from "../agents";
import { useHomeController } from "../controllers/useHomeController";


function Home({
  userName, // Destructure userName from props
  sessionId: externalSessionId, // Destructure sessionId and rename to externalSessionId
  fetchChatHistories, // Destructure fetchChatHistories from props
  selectAgent, // Destructure selectAgent from props
  setSelectedAgent, // Destructure setSelectedAgent from props
}) {
  const {
    chatInput,
    setChatInput,
    chatMessages,
    loading,
    chatWindowRef,
    tempSelectedAgent,
    setTempSelectedAgent,
    isModalOpenAgent,
    handleChatSubmit,
    chooseAgent,
    loadingMessageIndex,
    
  } = useHomeController({
    userName,
    sessionId: externalSessionId,
    fetchChatHistories,
    selectAgent,
    setSelectedAgent,
  });
  

  return (
    <div className="chat-container">
        <div className="chat-window" ref={chatWindowRef}>
            {chatMessages.map((message, index) => (
                <div key={index} className={`chat-message ${message.sender}`}>
                    <strong>{message.sender === "user" ? userName + ":" : "Bot:"}</strong>
                    {message.content ? (
    <div>
        {message.content.map((item, idx) =>
            item.type === 'text' ? (
                <p key={idx} style={{ whiteSpace: "pre-wrap" }}>
                    {item.value}
                    {loading && index === chatMessages.length - 1 && ".".repeat(loadingMessageIndex + 1)}
                </p>
            ) : (
                <img
                    key={idx}
                    src={item.value}
                    alt="Generated Chart"
                    style={{
                        maxWidth: "65%",
                        height: "auto",
                        display: "block",
                        padding: "10px",
                        marginBottom: "10px",
                        borderRadius: "8px",
                        backgroundColor: "white",
                    }}
                    onError={(e) => {
                        console.error("Image failed to load:", item.value);
                        e.target.style.display = "none"; // Hide broken images
                    }}
                />
            )
        )}
    </div>
) : (
    <p style={{ whiteSpace: "pre-wrap" }}>
        {message.text}
        {loading && index === chatMessages.length - 1 && ".".repeat(loadingMessageIndex + 1)}
    </p>
)}
                </div>
            ))}
        </div>

      <div className="container-of-chat-area">
        <div className="text-rec-head">แนะนำคำถาม </div>
        <div className="rec-question">
          {recommendedQuestions.map((question, index) => (
            <div
              key={index}
              className="question-box"
              onClick={() => setChatInput(question)}
            >
              {question}
            </div>
          ))}
        </div>

        <div className="chat-input-container">
          <textarea
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="กรุณาพิมพ์คำถาม . . ."
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleChatSubmit(selectAgent);
              }
            }}
            disabled={loading}
            rows={5}
            style={{ resize: "none" }}
          />
          <button
            onClick={()=>{handleChatSubmit(selectAgent)}}
            disabled={loading}
            style={{ background: "none", border: "none", cursor: "pointer" }}
          >
            {loading ? (
              "กำลังคิด..."
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#000000FF"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 2L11 13" />
                <path d="M22 2L15 22L11 13L2 9L22 2Z" />
              </svg>
            )}
          </button>
        </div>
      </div>
      {isModalOpenAgent && (
  <>
    <div className="modal-overlay" />
    <div className="home-modal-container">
      <div className="home-modal-content">
        <h3>กรุณาเลือก Agent ที่ต้องการจะถามก่อนใช้งาน</h3>
        <div className="home-modal-buttons">
          <select
            value={tempSelectedAgent}
            onChange={(e) => setTempSelectedAgent(e.target.value)}
          >
            <option value="">เลือก Agent</option>
            {agents.map((agent, index) => (
              <option key={index} value={agent}>
                {agent}
              </option>
            ))}
          </select>
          <button
            className="home-modal-button home-confirm-button"
            onClick={() => {if (tempSelectedAgent !== "") {chooseAgent(tempSelectedAgent)}}}
          >
            ยืนยัน
          </button>
        </div>
      </div>
    </div>
  </>
)}
    </div>
    
  );
}

export default Home;
