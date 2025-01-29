// server.js

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');

// Import routes
const chatbotRoutes = require('./routes/chatbotRoutes');

// Initialize dotenv for environment variables
dotenv.config();

// Use middlewares
app.use(cors());
app.use(bodyParser.json());

// Use routes
app.use('/api', chatbotRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
