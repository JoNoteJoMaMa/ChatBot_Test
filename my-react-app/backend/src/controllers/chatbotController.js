const axios = require('axios');

exports.chatbotResponse = async (req, res) => {
    try {
        const { sessionId, chatInput } = req.body;

        const response = await axios.post('http://209.15.111.1:5678/webhook/invoke_n8n_agent', {
            sessionId,
            chatInput
        });

        res.json(response.data); 
    } catch (error) {
        console.error('Error in chatbotController:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'ขออภัย แชทบอทเป็นลมระหว่างคิด', details: error.response ? error.response.data : error.message });
    }
};