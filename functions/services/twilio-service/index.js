const config = require('../../config').twilio;
const Twilio = require('twilio');
const client = Twilio(config.accountSid, config.authToken);

const AccessToken = Twilio.jwt.AccessToken;
const ChatGrant = AccessToken.ChatGrant;

function generateToken(userId) {
    const token = new AccessToken(
        config.accountSid,
        config.apiKey,
        config.apiSecret
    );  
    token.identity = userId;
    // token.TTL = 3600; // ?time to live https://www.twilio.com/docs/chat/create-tokens

    const chatGrant = new ChatGrant({
        serviceSid: config.chatServiceId,
        // endpointId: <string that identifies client, e.g. browser...> // https://www.twilio.com/docs/chat/tutorials/chat-application-node-express
    });
    token.addGrant(chatGrant);

    return {
        identity: token.identity,
        token: token.toJwt()
    };    
}

function createChannel(uniqueName, friendlyName, attributes) {
    const options = {
        type: 'private'
    };
    
    if (uniqueName) options.uniqueName = uniqueName;
    if (friendlyName) options.friendlyName = friendlyName;
    if (attributes) options.attributes = JSON.stringify(options);
    
    return client.chat.services(config.chatServiceId)
        .channels.create(options).then(channel => {
            console.log('twilio channel created', channel.sid, channel.uniqueName, channel.friendlyName);
            return channel;
        });
}

function createUser(identity, attributes) {
    const options = {
        identity,
        roleSid: config.userDeploymentRoleId
    };

    if (attributes) options.attributes = JSON.stringify(attributes);

    return client.chat.services(config.chatServiceId)
        .users.create(options)
        .then(user => {
            console.log('twilio user created', user.sid, user.identity, user.friendlyName, user.roleSid);
            return user;
        });
}

function createMember(channelSid, identity, attributes) {
    const options = {
        identity, 
        roleSid: config.userChannelRoleId
    };

    if (attributes) options.attributes = JSON.stringify(attributes);

    return client.chat.services(config.chatServiceId)
        .channels(channelSid)
        .members.create(options)
        .then(member => {
            console.log('twilio member created', member.sid, member.identity, member.attributes);
            return member;
        });
}


module.exports = {
    generateToken,
    createChannel,
    createUser,
    createMember,
}
