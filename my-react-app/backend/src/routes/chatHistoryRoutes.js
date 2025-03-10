const express = require("express");
const router = express.Router();

const chatHistoryController = require('../controllers/chatHistoryController');


router.get('/getChatHistory', chatHistoryController.getHistory);
router.get('/users/:user_ID', chatHistoryController.getUser);
router.post('/users/store-session', chatHistoryController.storeSessionInDB);
router.put('/users/updateSessionStatus', chatHistoryController.updateSessionStatus);
// router.delete('/deleteHistory', chatHistoryController.deleteHistory);

module.exports = router;