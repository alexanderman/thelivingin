const store = require('../database/firestore');

function getChatData(userId, chatId, requestId) {
    return Promise.all([
        store.getUserById(userId),
        store.getChatById(chatId),
        store.getRequestById(requestId)
    ])
    .then(results => {
        return {
            user: results[0],
            chat: results[1],
            request: results[2]
        }
    });
}

module.exports = {
    getChatData
};
