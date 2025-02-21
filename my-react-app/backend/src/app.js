const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const app = express();

// Import routes
const chatbotRoutes = require('./routes/chatbotRoutes');
const chatHistoryRoutes = require('./routes/chatHistoryRoutes'); // Import the new route

// Initialize dotenv for environment variables
dotenv.config();

// Use middlewares
app.use(cors());
app.use(bodyParser.json());

// Use routes
app.use('/api', chatbotRoutes);
app.use('/api', chatHistoryRoutes);

module.exports = app;
