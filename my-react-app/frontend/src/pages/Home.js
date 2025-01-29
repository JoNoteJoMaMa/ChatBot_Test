import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Home.css"; // Import a CSS file for styling

function Home() {
  const [sessionId] = useState("AAAAA"); // Example session ID
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);

  // Typing animation effect
  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setLoadingMessageIndex((prev) => (prev + 1) % 3);
      }, 500);
      return () => clearInterval(interval);
    }
  }, [loading]);

  const handleChatSubmit = async () => {
    if (!chatInput.trim()) return; // Prevent empty messages

    setLoading(true);
    const userMessage = { sender: "user", text: chatInput };
    setChatMessages((prevMessages) => [...prevMessages, userMessage]);

    // Add a temporary "typing..." message from the bot
    const loadingMessage = { sender: "bot", text: "กำลังคิด" };
    setChatMessages((prevMessages) => [...prevMessages, loadingMessage]);

    try {
      const response = await axios.post("http://localhost:5000/api/chatbot", {
        sessionId,
        chatInput,
      });

      // Replace the "Typing..." message with actual response
      setChatMessages((prevMessages) =>
        prevMessages.map((msg, index) =>
          index === prevMessages.length - 1
            ? { sender: "bot", text: response.data.message }
            : msg
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

  return (
    <div className="chat-container">
      <div className="chat-window">
        {chatMessages.map((message, index) => (
          <div key={index} className={`chat-message ${message.sender}`}>
            <strong>{message.sender === "user" ? "You:" : "Bot:"}</strong>{" "}
            {message.text}
            {loading && index === chatMessages.length - 1 && ".".repeat(loadingMessageIndex + 1)}
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
              e.preventDefault(); // Prevents adding a new line on Enter
              handleChatSubmit();
            }
          }}
          disabled={loading}
          rows={5} // Adjust the number of visible lines
          style={{ resize: "none" }} // Prevent manual resizing
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
  );
}

export default Home;
