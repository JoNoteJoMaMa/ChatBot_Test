const { Pool } = require("pg");
const dotenv = require('dotenv');

dotenv.config();

// PostgreSQL connection
const pool = new Pool({
  user: process.env.POSTGRESQL_USER,
  host: process.env.POSTGRESQL_HOST, 
  database: process.env.POSTGRESQL_DATABASE, 
  password: process.env.POSTGRESQL_PASSWORD, 
  port: process.env.POSTGRESQL_PORT,
});

exports.createNewUser = async (req, res) => {
  const { userId,userName,userEmail } = req.query;

  if (!sessionId) {
    return res.status(400).json({ error: "Session ID is required" });
  }

  try {

    // const createUser = `
    //   INSERT INTO users (user_id, username, email, sid)
    //   VALUES (
    //     $1,  -- Replace with the actual user ID
    //     $1,  -- Replace with the actual username
    //     $3,  -- Replace with the actual email
    //     ARRAY[]::jsonb[]     -- Empty JSONB array
    //   )
    //   RETURNING *;
    // `;

    const values = [userId,userName,userEmail];

    const result = await pool.query(`CALL create_new_user($1, $2, $3)`, values);

    res.json({
      message: `User created successfully!`,
      user: result.rows[0]
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


// Function to get user details by user_ID
exports.getUser = async (req, res) => {
  const { user_ID } = req.params; // Extract user_ID from the request parameters

  if (!user_ID) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    // Query the database to find the user by user_ID
    // const query = `
    //   SELECT user_ID, userName, userEmail, sID
    //   FROM public.users
    //   WHERE user_ID = $1;
    // `;
    const values = [user_ID];

    const result = await pool.query(`CALL get_user($1, NULL)`, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Return the user data
    const user = result.rows[0];
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'An error occurred while fetching the user' });
  }
};

exports.storeSessionInDB = async (req, res) => {
  const { user_ID, sessionId } = req.body; // Extract user_ID and sessionID from the request body

  if (!user_ID || !sessionId) {
    return res.status(400).json({ error: 'User ID and Session ID are required' });
  }

  try {
    // Create a new session object with the default status of 1
    const newSession = { sessionId, status: 1 };

    // Log the new session object
    console.log('New session object:', newSession);

    // Add the new session object to the sID array
    // const query = `
    //   UPDATE public.users
    //   SET sID = array_append(sID, $1::JSONB)
    //   WHERE user_ID = $2
    //   RETURNING *;
    // `;
    const values = [newSession, user_ID];

    // Log the query and values
    // console.log('Query:', `CALL store_session_in_db`);
    // console.log('Values:', values);

    const result = await pool.query(`CALL store_session_in_db($1, $2)`, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Return the updated user data
    const user = result.rows[0];
    res.status(200).json({ message: 'Session ID stored successfully!', user });
  } catch (error) {
    console.error('Error storing session ID:', error);
    res.status(500).json({ error: 'An error occurred while storing the session ID' });
  }
};

// API endpoint to fetch chat history by session ID
exports.getHistory = async (req, res) => {
  const { sessionId } = req.query;

  if (!sessionId) {
    return res.status(400).json({ error: "Session ID is required" });
  }

  try {
    // Call the stored procedure and fetch the OUT parameter (chat history)
    const result = await pool.query(`
      CALL public.get_history($1, NULL);
    `, [sessionId]);

    // Get the chat history from the procedure's OUT parameter
    const chatHistory = result.rows[0].p_chat_history;

    // Extract the first question (type: "human") from the chat history
    const firstQuestion = chatHistory.find((row) => row.message.type === "human")?.message.content || "No question found";

    // Return the response with the chat history
    res.json({
      sessionId,
      firstQuestion,
      messages: chatHistory,
    });
  } catch (error) {
    console.error("Error fetching chat history:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

  
  // API endpoint to delete a session by session ID
// exports.deleteHistory = async (req, res) => {
//   const { sessionId } = req.query;

//   if (!sessionId) {
//     return res.status(400).json({ error: "Session ID is required" });
//   }

//   try {
//     // Delete from chat histories
//     const deleteQuery = `
//       DELETE FROM public.${process.env.TABLE_HISTORY}
//       WHERE session_id = $1;
//     `;
//     await pool.query(deleteQuery, [sessionId]);

//     console.log(`Session with sessionId ${sessionId} deleted from chat histories`);

//     res.json({
//       message: `Session with sessionId ${sessionId} deleted successfully!`,
//     });
//   } catch (error) {
//     console.error("Error deleting session:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

exports.updateSessionStatus = async (req, res) => {
  const { user_ID, sessionId } = req.body;

  if (!user_ID || !sessionId) {
    return res.status(400).json({ error: 'User ID and Session ID are required' });
  }

  try {
    // const query = `
    //   WITH session_index AS (
    // SELECT idx - 1 as array_index
    // FROM users,
    // LATERAL unnest(sid) WITH ORDINALITY AS t(elem, idx)
    // WHERE user_id = $2
    // AND elem->>'sessionId' = $1
    // )
    // UPDATE users
    // SET sid = (
    //     SELECT array_agg(
    //         CASE 
    //             WHEN ordinality - 1 = array_index 
    //             THEN jsonb_set(elem, '{status}', '0'::jsonb)
    //             ELSE elem
    //         END
    //     )
    //     FROM unnest(sid) WITH ORDINALITY as t(elem, ordinality), session_index
    // )
    // WHERE user_id = $2
    // RETURNING *;
    // `;
    const values = [sessionId, user_ID];

    // console.log('Query:', `CALL update_session_status($1,$2)`); // Log the query
    // console.log('Values:', values); // Log the values

    const result = await pool.query(`CALL update_session_status($1, $2)`, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User or session not found' });
    }

    // Return the updated user data
    const user = result.rows[0];
    res.status(200).json({ message: 'Session status updated successfully!', user });
  } catch (error) {
    console.error('Error updating session status:', error);
    res.status(500).json({ error: 'An error occurred while updating the session status' });
  }
};