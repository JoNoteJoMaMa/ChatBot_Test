const express = require('express');
const router = express.Router();

// Import the chatbotController
const chatbotController = require('../controllers/chatbotController');

// Define the route for handling the chatbot response
router.post('/chatbot/:agentName', chatbotController.chatbotResponse);

module.exports = router;
