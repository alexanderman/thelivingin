/** 
 * connection service between buisness logic and twilio API
 */
const twilioService = require('./index');
const store = require('../../database/firestore');

 /**
 * @description creates user in twilio if needed & updates user in db, returns twilio user sid 
 * @param {Object} user 
 * @returns {Promise<user_sid>}
 */
 function ensureUser(user, options = { updateDb: true }) {
    if (user.twilio) {
        return Promise.resolve(user.twilio.sid);
    }
    return twilioService.ensureUser(user._id, { email: user.email, name: user.name })
        .then(twUser => {
            return options.updateDb 
                ? store.updateUser(user._id, { 'twilio.sid': twUser.sid }).then(() => twUser.sid)
                : twUser.sid;
        });
}

/**
 * @description creates member in twilio if needed and updates chat, returns twilio member sid
 * @param {Object} user 
 * @param {Object} chat
 * @returns {Promise<member_sid>}
 */
function ensureMember(user, chat, options = { updateDb: true }) {
    if (!chat.twilio) {
        return Promise.reject(new Error('expected chat with existing twilio channel'));
    }
    if (chat.twilio.members && chat.twilio.members[user._id]) {
        return Promise.resolve(chat.twilio.members[user._id].sid);
    }

    return twilioService.createMember(chat.twilio.sid, user._id)
        .then(member => {
            if (options.updateDb) {
                const key = `twilio.members.${user._id}`;
                const updateData = {};
                updateData[key] = member.sid;
                return store.updateChat(chat._id, updateData).then(() => member.sid);
            }
            else
                return member.sid;
        });
}

function removeMember(user, chat) {
    if (!chat.twilio) {
        return Promise.reject(new Error('expected chat with existing twilio channel'));
    }

    if (!user.twilio) {
        return Promise.reject(new Error('expected user with existing twilio sid'));
    }

    return twilioService.deleteMember(chat.twilio.sid, chat.twilio.members[user._id])
        .then(() => store.deleteChatMember(chat._id, user._id));
}

/**
 * @description creates twilio user if needed + adds member to chat + upadtes db with twilio keys
 * @param {*} user 
 * @param {*} chat 
 * @returns {Promise}
 */
function addUserToChat(user, chat) {
    return Promise.all([
        ensureUser(user),
        ensureMember(user, chat)
    ]);
}

module.exports = {
    ensureMember,
    ensureUser,
    addUserToChat,
    removeMember,
}
