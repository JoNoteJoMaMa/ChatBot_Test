import React, { useState, useEffect, useRef } from "react";
import { auth } from "../firebase";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../firebase";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { extractImageAndText, isImageUrlDetect, extractTextOnly } from "../extractImgLink";
import "../css/Home.css";
import Cookies from "js-cookie"; // Import js-cookie


export const useHomeController = ({ userName, sessionId: externalSessionId, fetchChatHistories, selectAgent, setSelectedAgent }) => {
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

const storeNewSession = async () => {
    if (isSessionStored || !auth.currentUser) return;
    const user_ID = auth.currentUser.uid;
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}api/users/store-session`,
        { user_ID, sessionId } // Send data in the request body
      );
  
      console.log("Session ID stored successfully!");
      setIsSessionStored(true); // Prevent duplicate updates
    } catch (error) {
      console.error("Error storing session ID:", error);
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
        await storeNewSession();
        fetchChatHistories();
        
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
        
    }
};

  // Scroll to bottom whenever chatMessages changes
  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [chatMessages]);

  return {
    setSessionId,
    chatInput,
    setChatInput,
    chatMessages,
    setChatMessages,
    loading,
    setLoading,
    loadingMessageIndex,
    setLoadingMessageIndex,
    isSessionStored,
    setIsSessionStored,
    chatWindowRef,
    tempSelectedAgent,
    setTempSelectedAgent,
    isModalOpenAgent,
    setIsModalOpenAgent,
    handleChatSubmit, // Add this
    chooseAgent, 
    fetchChatHistories,
    loadingMessageIndex,
  };
};
