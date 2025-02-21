const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

exports.chatbotResponse = async (req, res) => {
    try {
        const { sessionId, chatInput } = req.body;
        const { agentName } = req.params;
   
        const response = await axios.post(`${process.env.CHATMODEL_URL}${agentName}`, {
            sessionId,
            chatInput
        });

        res.json(response.data); 
    } catch (error) {
        console.error('Error in chatbotController:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'ขออภัย แชทบอทเป็นลมระหว่างคิด', details: error.response ? error.response.data : error.message });
    }
};