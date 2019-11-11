const store = require('../database/firestore');
const twilioService = require('./twilio-service');

function getChatData(userId, chatId, requestId) {
    return Promise.all([
        store.getUserById(userId),
        store.getChatById(chatId),
        store.getRequestById(requestId)
    ])
    .then(promResults => {
        const result = {
            user: promResults[0],
            chat: promResults[1],
            request: promResults[2],
            twilioToken: twilioService.generateToken(userId).token
        };

        if (!result.user || !result.chat || !result.request) {
            throw new Error('chat with provided parameters not found');
        }

        return result;
    });
}

module.exports = {
    getChatData
};
