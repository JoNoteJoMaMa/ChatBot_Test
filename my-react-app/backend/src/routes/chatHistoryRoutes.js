const express = require("express");
const { Pool } = require("pg");
const router = express.Router();

// PostgreSQL connection
const pool = new Pool({
  user: "admin_post", // Replace with your PostgreSQL username
  host: "209.15.119.193", // Replace with your PostgreSQL host (e.g., "localhost")
  database: "llm", // Replace with your database name
  password: "TLU]&6,P{d+qKx`5", // Replace with your PostgreSQL password
  port: 5432, // Default PostgreSQL port
});

// API endpoint to fetch chat history by session ID
router.get("/chat-history", async (req, res) => {
    const { sessionId } = req.query;
  
    if (!sessionId) {
      return res.status(400).json({ error: "Session ID is required" });
    }
  
    try {
      const query = `
        SELECT id, session_id, message
        FROM public.n8n_chat_histories_new
        WHERE session_id = $1
        ORDER BY id ASC;
      `;
      const result = await pool.query(query, [sessionId]);
  
      // Extract the first question (type: "human") from the chat history
      const firstQuestion = result.rows.find((row) => row.message.type === "human")?.message.content || "No question found";
  
      res.json({
        sessionId,
        firstQuestion,
        messages: result.rows,
      });
    } catch (error) {
      console.error("Error fetching chat history:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  
  // API endpoint to delete a session by session ID
router.delete("/delete-session", async (req, res) => {
  const { sessionId } = req.query;

  if (!sessionId) {
    return res.status(400).json({ error: "Session ID is required" });
  }

  try {
    // Delete from chat histories
    const deleteQuery = `
      DELETE FROM public.n8n_chat_histories_new
      WHERE session_id = $1;
    `;
    await pool.query(deleteQuery, [sessionId]);

    console.log(`Session with sessionId ${sessionId} deleted from chat histories`);

    res.json({
      message: `Session with sessionId ${sessionId} deleted successfully!`,
    });
  } catch (error) {
    console.error("Error deleting session:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

  module.exports = router;