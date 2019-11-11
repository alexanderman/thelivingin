const store = require('../database/firestore');
const twilioService = require('./twilio-service');
const chatService = require('./twilio-service/chat-service');

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

        const { user, chat } = result;
        
        /** TODO: move this logic to submit request */
        return Promise.all([
            chatService.ensureUser(user),
            chatService.ensureMember(user, chat)
        ]).then(() => result);
    });
}

module.exports = {
    getChatData
};
