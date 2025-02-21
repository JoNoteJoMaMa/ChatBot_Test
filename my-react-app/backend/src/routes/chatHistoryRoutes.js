const express = require("express");
const router = express.Router();

const chatHistoryController = require('../controllers/chatHistoryController');


router.get('/getChatHistory', chatHistoryController.getHistory);
router.delete('/deleteHistory', chatHistoryController.deleteHistory);

module.exports = router;