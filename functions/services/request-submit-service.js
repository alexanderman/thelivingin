const store = require('../database/firestore');
const twilioService = require('./twilio-service');
const chatService = require('./twilio-service/chat-service');

/** fetch admins, ensure twilio sid and return admins  */
function prepareAdmins() {
    return store.getAdmins().then(admins => !admins 
        ? Promise.resolve([]) : Promise.all(
            admins.map(admin => chatService.ensureUser(admin).then(sid => ({ ...admin, twilio: { sid } }) ))
    ));
}

/** ensures user has twilio sid and returns user  */
function prepareUser(userId, requestData, requestId, user) {
    const userExists = !!user;

    const userData = {
        _id: userId,
        name: requestData.name,
        email: requestData.email,
        phone: requestData.phone,
        canHelp: userExists ? user.canHelp : false,
        requests: userExists ? [...(user.requests || []), requestId] : [requestId]
    };

    const twilioPromise = userExists && user.twilio
        ? Promise.resolve(user.twilio.sid)
        : twilioService.createUser(userId, { email: userData.email, name: userData.name }).then(t => t.sid);

    return twilioPromise.then(sid => {
        const dbMethod = userExists ? store.updateUser : store.createUser;
        return dbMethod(userId, { ...userData, twilio: { sid } })
            .then(() => ({ ...userData, twilio: { sid } }))
    });
}

function prepareChat(userId, requestId, chatId, userPromise, adminsPromise) {
    const chatData = {
        issuedBy: userId,
        requestId
    };

    const createChannel = twilioService.createChannel(chatId)
        .then(channel => chatData.twilio = { sid: channel.sid, members: {} });

    const prepareChannelUsers = Promise.all([adminsPromise, userPromise])
        .then(res => [...res[0], res[1]]);

    const createMembers = ([twilioData, users]) => {
        const { sid, members } = twilioData;
        return Promise.all(users.map(u => twilioService.createMember(sid, u._id)
            .then(m => members[u._id] = m.sid))
        );
    };

    const saveChat = () => store.createChat(chatId, chatData);

    return Promise.all([createChannel, prepareChannelUsers])
        .then(createMembers)
        .then(saveChat);
}


function registerRequest(request) {
    const { email } = request;

    const adminsPromise = prepareAdmins();

    return store.getUserByEmail(email)
    .then(user => {
        const userExists = !!user;
        const userId = userExists ? user._id : store.generateUserId();
        const chatId = store.generateChatId();
        const requestId = store.generateRequestId();

        const requestData = {
            ...request,
            issuedBy: userId,
            chats: [chatId]
        };
        const requestPromise = store.createRequest(requestId, requestData);
        const userPromise = prepareUser(userId, requestData, requestId, user);
        const chatPromise = prepareChat(userId, requestId, chatId, userPromise, adminsPromise);
        
        return Promise.all([requestPromise, chatPromise]);
    });
}


module.exports = {
    registerRequest
}

