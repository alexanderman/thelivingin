const result = require('dotenv').config();

if (result.error) {
    throw result.error;
}

module.exports = {
    twilio: {
        accountSid: process.env.TWILIO_ACCOUNT_SID,
        apiKey: process.env.TWILIO_API_KEY,
        apiSecret: process.env.TWILIO_API_SECRET,
        chatServiceId: process.env.TWILIO_CHAT_SERVICE_SID,
    }
};


