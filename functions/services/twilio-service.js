const config = require('../config').twilio;
const Twilio = require('twilio');

const AccessToken = Twilio.jwt.AccessToken;
const ChatGrant = AccessToken.ChatGrant;

function generateToken(userId) {
    const token = new AccessToken(
        config.accountSid,
        config.apiKey,
        config.apiSecret
    );  
    
    token.identity = userId;

    const chatGrant = new ChatGrant({
        serviceSid: config.chatServiceId
    });
    
    token.addGrant(chatGrant);

    return {
        identity: token.identity,
        token: token.toJwt()
    };    
}

module.exports = {
    generateToken
}