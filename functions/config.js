const result = require('dotenv').config();

if (result.error) {
    throw result.error;
}

module.exports = {
    twilio: {
        accountSid: process.env.TWILIO_ACCOUNT_SID,
        apiKey: process.env.TWILIO_API_KEY,
        apiSecret: process.env.TWILIO_API_SECRET,
        authToken: process.env.TWILIO_AUTH_TOKEN,
        chatServiceId: process.env.TWILIO_CHAT_SERVICE_SID,
        userChannelRoleId: process.env.TWILIO_USER_CHANNEL_ROLE_SID,
        userDeploymentRoleId: process.env.TWILIO_USER_DEPLOYMENT_ROLE_SID,
    },
    adminToken: process.env.ADMIN_TOKEN,
};


