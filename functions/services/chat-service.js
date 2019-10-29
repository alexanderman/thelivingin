const store = require('../database/firestore');
const twilioService = require('./twilio-service');

/** creates user in twilio if needed & updates user in db, returns twilio user sid */
function handleUserTwilio(user) {
    if (user.twilio) {
        return Promise.resolve(user.twilio.sid);
    }
    return twilioService.createUser(user._id, { email: user.email, canHelp: user.canHelp, name: user.name })
        .then(twUser => {
            return store.updateUser(user._id, { 'twilio.sid': twUser.sid })
                .then(() => twUser.sid);
        });
}

/** created member in twilio if needed, returns twilio member sid */
function handleMemberTwilio(user, chat) {
    if (!chat.twilio) {
        return Promise.reject(new Error('expected chat with existing twilio channel'));
    }
    if (chat.twilio.members && chat.twilio.members[user._id]) {
        return Promise.resolve(chat.twilio.members[user._id].sid);
    }

    return twilioService.createMember(chat.twilio.sid, user._id)
        .then(member => {
            const key = `twilio.members.${user._id}`;
            const updateData = {};
            updateData[key] = member.sid;
            return store.updateChat(chat._id, updateData).then(() => member.sid);
        });
}


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
        
        return Promise.all([
            handleUserTwilio(user),
            handleMemberTwilio(user, chat)
        ]).then(() => result);
    });
}

module.exports = {
    getChatData
};
