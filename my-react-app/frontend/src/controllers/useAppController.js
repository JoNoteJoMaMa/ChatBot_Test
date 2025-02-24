import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { doc, getDoc, arrayRemove, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import axios from "axios";
import Cookies from "js-cookie";

export const useAppController = () => {
  const [isMenuExpanded, setIsMenuExpanded] = useState(false);
  const [isFreqExpanded, setIsFreqExpanded] = useState(false);
  const [isHisExpanded, setIsHisExpanded] = useState(false);
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);
  const [chatHistories, setChatHistories] = useState({});
  const [sessionId, setSessionId] = useState("");
  const [isModalOpenHis, setIsModalOpenHis] = useState(false);
  const [isModalOpenHisDelAlert, setIsModalOpenHisDelAlert] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const [selectAgent, setSelectedAgent] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        const fetchUserName = async () => {
          const user_ID = auth.currentUser.uid;
            try {
              // Fetch the user's sID array from the SQL backend
              const userResult = await axios.get(
                `${process.env.REACT_APP_BACKEND_URL}api/users/${user_ID}`
              );

              if (userResult.data) {
                const user_name = userResult.data.username || ""; // Extract the sID array
                setUserName(user_name);
              }
            } catch (error) {
              console.error("Error fetching chat histories:", error);
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

  useEffect(() => {
    if (isHisExpanded && user) {
      fetchChatHistories();
    }
  }, [isHisExpanded, user]);

  useEffect(() => {
    if (isModalOpenHis) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }

    return () => {
      document.body.classList.remove("modal-open");
    };
  }, [isModalOpenHis]);

  useEffect(() => {
    const savedAgent = Cookies.get("selectedAgent");
    if (savedAgent) {
      setSelectedAgent(savedAgent);
    }
  }, []);

  const fetchChatHistories = async () => {
    const user_ID = auth.currentUser.uid;

    try {
      // Fetch the user's sID array from the SQL backend
      const userResult = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}api/users/${user_ID}`
      );

      if (userResult.data) {
        const sIDArray = userResult.data.sid || []; // Extract the sID array

        const sessionIds = sIDArray
        .filter(session => session.status === 1)
        .map(session => session.sessionId);
        const histories = {};
        

        // Fetch chat history for each session ID
        for (const sessionId of sessionIds) {
          try {
            const response = await axios.get(
              `${process.env.REACT_APP_BACKEND_URL}api/getChatHistory`,
              {
                params: { sessionId },
              }
            );

            if (response.data) {
              histories[sessionId] = response.data;
            }
          } catch (error) {
            console.error(
              `Error fetching chat history for sessionId ${sessionId}:`,
              error
            );
          }
        }

        setChatHistories(histories);
        console.log("This is chat history:", histories); // Log the final histories object
      }
    } catch (error) {
      console.error("Error fetching chat histories:", error);
    }
  };

  const goToNewChat = () => {
    navigate("/");
    setTimeout(() => {
      window.location.reload();
    }, 1);
  };

  const openPopUptoDeleteHis = (sessionId) => {
    setSelectedSessionId(sessionId);
    setIsModalOpenHis(true);
  };

  const cancelPopUptoDeleteHis = () => {
    setIsModalOpenHis(false);
    setSelectedSessionId(null);
    console.log("Session deletion canceled.");
  };

  const confirmDelete = async () => {
    if (selectedSessionId) {
      await handleSessionClickDel(selectedSessionId);

      setIsModalOpenHis(false);
      setIsModalOpenHisDelAlert(true);
      setSelectedSessionId(null);
    }
  };

  // const handleDeleteSession = async (sessionId) => {
  //   try {
  //     const response = await axios.delete(
  //       `${process.env.REACT_APP_BACKEND_URL}api/deleteHistory`,
  //       {
  //         params: { sessionId },
  //       }
  //     );

  //     const urlParams = new URLSearchParams(window.location.search);
  //     const sessionIdFromUrl = urlParams.get("sessionId");
  //     if (sessionId === sessionIdFromUrl) {
  //       window.location.reload();
  //     }
  //   } catch (error) {
  //     console.error("Error deleting session:", error);
  //     alert("An error occurred while deleting the session.");
  //   }
  // };

  // const removeSessionFromDB = async (sessionId) => {
  //   if (!auth.currentUser || !sessionId) return;

  //   try {
  //     const userRef = doc(db, "Users", auth.currentUser.uid);
  //     await updateDoc(userRef, {
  //       sID: arrayRemove(sessionId),
  //     });
  //     console.log("Session ID removed successfully!");
  //     fetchChatHistories();
  //   } catch (error) {
  //     console.error("Error removing session ID:", error);
  //   }
  // };

  const hideSessionFromUser = async (sessionId) => {
    const user_ID = auth.currentUser.uid;
  
    try {
      // Changed to PUT request since we're updating data
      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}api/users/updateSessionStatus`,
        { user_ID, sessionId }  // Send data in request body
      );
  
      if (response.data) {
        // Refresh chat histories after successful update
        await fetchChatHistories();
        console.log("Session status updated successfully");
      }
  
    } catch (error) {
      console.error(
        `Error removing session for sessionId ${sessionId}:`,
        error
      );
    }
  };

  const handleSessionClick = (sessionId) => {
    setSessionId(sessionId);
    navigate(`/?sessionId=${sessionId}`);
  };

  const handleSessionClickDel = async (sessionId) => {
    if (!sessionId) return;

    try {
      await hideSessionFromUser(sessionId);

      console.log("Session deleted from user account successfully!");
    } catch (error) {
      console.error("Error handling session in user delete:", error);
      alert("Failed to delete session from user account.");
      return;
    }
  };

  const handleFinishedDel = (sessionId) => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const sessionIdFromUrl = urlParams.get("sessionId");
      if (sessionId === sessionIdFromUrl) {
        window.location.reload();
      }
      setIsModalOpenHisDelAlert(false);
    } catch (error) {
      console.error("Error refresh fetch new chat", error);
    }
  };

  const chooseAgent = (agentName) => {
    console.log(`Selected Agent: ${agentName}`);
    setSelectedAgent(agentName);
    Cookies.set("selectedAgent", agentName, { expires: 7 });
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      document.cookie =
        "selectedAgent=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return {
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
  };
};
