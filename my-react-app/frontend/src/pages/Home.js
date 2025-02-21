import React, { useState, useEffect, useRef } from "react";
import { auth } from "../firebase";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../firebase";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { extractImageAndText, isImageUrlDetect, extractTextOnly } from "../extractImgLink";
import { recommendedQuestions } from "../RecommendedQuestions";
import "./Home.css";
import Cookies from "js-cookie"; // Import js-cookie
import { agents } from "../agents";


function Home({ userName, sessionId: externalSessionId, fetchChatHistories,selectAgent, setSelectedAgent }) {
  const [sessionId, setSessionId] = useState(""); // Store session ID
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const [isSessionStored, setIsSessionStored] = useState(false); // Ensure we update Firestore only once
  const chatWindowRef = useRef(null); // Create a ref for the chat window
  const [tempSelectedAgent, setTempSelectedAgent] = useState("");
  const [isModalOpenAgent, setIsModalOpenAgent] = useState(false); // pop-up for confirm delete the history
    


  const chooseAgent = (agentName) => {
    console.log(`Selected Agent: ${agentName}`);
    setSelectedAgent(agentName);
    Cookies.set("selectedAgent", agentName, { expires: 7 }); // Save in cookies for 7 days
    window.location.reload(); 
    setIsModalOpenAgent(false);
  };

  useEffect(() => {
    // Retrieve the agent from cookies when the component loads
    const savedAgent = Cookies.get("selectedAgent");
    if (savedAgent) {
      setSelectedAgent(savedAgent);
     
    }else{
      setIsModalOpenAgent(true);
    } 
  }, []);

  // Generate sessionId & Update URL when user enters `/` page
  useEffect(() => {
    if (!externalSessionId) {
      let existingSessionId = new URLSearchParams(window.location.search).get("sessionId");
 
        existingSessionId = uuidv4();
        window.history.replaceState({}, "", `/?sessionId=${existingSessionId}`); // Update URL without reloading


      setSessionId(existingSessionId);
    } else {
      setSessionId(externalSessionId);
      fetchChatHistory(externalSessionId);
    }
  }, [externalSessionId]);

  const fetchChatHistory = async (sessionId) => {
    try {
        const response = await axios.get( `${process.env.REACT_APP_BACKEND_URL}api/getChatHistory`, {
            params: { sessionId },
        });

        const mappedMessages = response.data.messages.map((message) => {
            if (message.message.type === "human") {
                // User messages: Treat as plain text
                return {
                    sender: "user",
                    content: [{ type: 'text', value: message.message.content }],
                };
            } else {
                // Bot messages: Process for images and text
                const content = extractImageAndText(message.message.content);
                return {
                    sender: "bot",
                    content: content,
                };
            }
        });

        setChatMessages(mappedMessages);
    } catch (error) {
        console.error("Error fetching chat history:", error);
    }
};
  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setLoadingMessageIndex((prev) => (prev + 1) % 3);
      }, 500);
      return () => clearInterval(interval);
    }
  }, [loading]);

  // Function to store sessionId in Firestore (called only when user starts chat)
  const storeSessionInDB = async () => {
    if (isSessionStored || !auth.currentUser) return;

    try {
      const userRef = doc(db, "Users", auth.currentUser.uid);
      await updateDoc(userRef, {
        sID: arrayUnion(sessionId),
      });
      console.log("Session ID stored successfully!");
      setIsSessionStored(true); // Prevent duplicate updates
    } catch (error) {
      console.error("Error storing session ID:", error);
    }
  };

  const handleChatSubmit = async (agentName) => {
    if (!chatInput.trim()) return;
    setLoading(true);
    const userMessage = { sender: "user", text: chatInput };
    setChatMessages((prevMessages) => [...prevMessages, userMessage]);

    setChatMessages((prevMessages) => [...prevMessages, { sender: "bot", text: "กำลังคิด" }]);

    try {
        
        const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}api/chatbot/${agentName}`, {
            sessionId,
            chatInput,
        });

        const content = extractImageAndText(response.data.message);

        const botMessage = { sender: "bot", content };

        setChatMessages((prevMessages) =>
            prevMessages.map((msg, index) =>
                index === prevMessages.length - 1 ? botMessage : msg
            )
        );
        
    } catch (error) {
        console.error("Error in chatbot API call:", error);
        setChatMessages((prevMessages) =>
            prevMessages.map((msg, index) =>
                index === prevMessages.length - 1
                    ? { sender: "bot", content: [{ type: 'text', value: 'Error: ขออภัย แชทบอทเป็นลมระหว่างคิด' }] }
                    : msg
            )
        );
    } finally {
        setLoading(false);
        
        setChatInput("");
        // **Store session ID in Firestore ONLY if the user starts a chat**
        await storeSessionInDB();
        fetchChatHistories();
    }
};

  // Scroll to bottom whenever chatMessages changes
  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [chatMessages]);

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
