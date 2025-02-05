import React, { useState, useEffect, useRef } from "react";
import { auth } from "../firebase";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../firebase";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { extractImageAndText, isImageUrlDetect } from "../extractImgLink";
import { recommendedQuestions } from "../RecommendedQuestions";
import "./Home.css";

function Home({ userName }) {
  const [sessionId, setSessionId] = useState(""); // Store session ID
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const [isSessionStored, setIsSessionStored] = useState(false); // Ensure we update Firestore only once
  const chatWindowRef = useRef(null); // Create a ref for the chat window

  // Generate sessionId & Update URL when user enters `/` page
  useEffect(() => {
    let existingSessionId = new URLSearchParams(window.location.search).get("sessionId");

    existingSessionId = uuidv4();
    window.history.replaceState({}, "", `/?sessionId=${existingSessionId}`); // Update URL without reloading

    setSessionId(existingSessionId);
  }, []);

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

  const handleChatSubmit = async () => {
    if (!chatInput.trim()) return;

    setLoading(true);
    const userMessage = { sender: "user", text: chatInput };
    setChatMessages((prevMessages) => [...prevMessages, userMessage]);

    setChatMessages((prevMessages) => [...prevMessages, { sender: "bot", text: "กำลังคิด" }]);

    try {
      // **Store session ID in Firestore ONLY if the user starts a chat**
      await storeSessionInDB();

      const response = await axios.post("http://209.15.111.1:5678/webhook/n8n_Sale2012", {
        sessionId,
        chatInput,
      });

      const { imageUrl, description } = extractImageAndText(response.data.message);

      const botMessage = isImageUrlDetect(response.data.message)
        ? { sender: "bot", text: description, imageUrl }
        : { sender: "bot", text: response.data.message };

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
            ? { sender: "bot", text: "Error: Could not fetch response from chatbot." }
            : msg
        )
      );
    } finally {
      setLoading(false);
      setChatInput("");
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
            {message.sender === "bot" && message.imageUrl ? (
              <div>
                <img
                  src={message.imageUrl}
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
                />
                <p style={{ whiteSpace: "pre-wrap" }}>
                  {message.text}
                  {loading && index === chatMessages.length - 1 && ".".repeat(loadingMessageIndex + 1)}
                </p>
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
        <div className="text-rec-head">แนะนำคำถาม</div>
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
                handleChatSubmit();
              }
            }}
            disabled={loading}
            rows={5}
            style={{ resize: "none" }}
          />
          <button
            onClick={handleChatSubmit}
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
    </div>
  );
}

export default Home;
