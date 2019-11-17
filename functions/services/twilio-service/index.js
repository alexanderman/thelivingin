/**
 * wrapper on twilio API, no database objects or other app logic should be here
 * use chat-service for app logic
 */
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

function fetchUser(identity) {
    return client.chat.services(config.chatServiceId).users(identity).fetch();
}

function fetchMember(channelSid, identity) {
    return client.chat.services(config.chatServiceId).channels(channelSid).members(identity).fetch();
}

/** if user with this identity already exists, fetch it */
function ensureUser(identity, attributes) {
    return createUser(identity, attributes)
    .catch(err => {
        if (err.status === 409 && err.code === 50201) {
            return fetchUser(identity);
        }
        throw err;
    });
}

function ensureMember(channelSid, identity, attributes) {
    return createMember(channelSid, identity, attributes)
    .catch(err => {
        if (err.status === 409 && err.code === 50404) {
            return fetchMember(channelSid, identity);
        }
        throw err;
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

function deleteMember(channelSid, memberSid) {
    return client.chat.services(config.chatServiceId)
        .channels(channelSid).members(memberSid).remove();
}

function sendSms(to, body) {
    console.log('sms to', to);
    return client.messages.create({
        from: config.sms_from_phone,
        to,
        body,
        statusCallback: config.webhook_url,
    });
}


module.exports = {
    generateToken,
    createChannel,
    createUser,
    createMember,

    fetchUser,
    ensureUser,
    ensureMember,
    deleteMember,

    sendSms,
}
