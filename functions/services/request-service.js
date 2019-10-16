const store = require('../database/firestore');

function registerRequest(request) {
    const { email } = request;
    
    return store.getUserByEmail(email)
    .then(user => {
        const userExists = !!user;

        const userId = userExists ? user._id : store.generateUserId();
        const chatId = store.generateChatId();
        const requestId = store.generateRequestId();
        console.log(`userId ${userExists}:${userId}; chatId:${chatId}; requestId:${requestId}`);
    
        const promises = [];

        const requestData = {
            ...request,
            issuedBy: userId
        };
        promises.push(store.createRequest(requestId, requestData));
    
        const chatData = {
            issuedBy: userId,
            requestId
        };
        promises.push(store.createChat(chatId, chatData));

        if (userExists) {
            promises.push(store.addRequestToUser(userId, requestId));
        }
        else {
            const userData = {
                name: requestData.name,
                email: requestData.email,
                phone: requestData.phone,
                canHelp: false,
                requests: [requestId]
            };
            promises.push(store.createUser(userId, userData));
        }
    
        return Promise.all(promises);
    });
}

module.exports = {
    registerRequest
}