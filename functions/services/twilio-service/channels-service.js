const config = require('../../config').twilio;
const Twilio = require('twilio');
const client = Twilio(config.accountSid, config.authToken);

/** https://www.twilio.com/docs/chat/rest/channel-resource */

function getChannels() {
    return client.chat.services(config.chatServiceId)
    .channels.list({ limit: 20 })
    .then(channels => {
        channels.forEach(channel => {
            console.log(channel.friendlyName, channel.uniqueName, channel.sid);
        });
        return channels;
    });
}

function getChannel(sid) {
    return client.chat.services(config.chatServiceId)
    .channels(sid).fetch()
    .then(channel => {
        console.log(channel.friendlyName, channel.uniqueName, channel.sid);
        return channel;
    });
}

function createChannel() {
    return client.chat.services(config.chatServiceId)
    .channels.create({ type: 'private' }).then(channel => {
        console.log('channel created', channel.friendlyName, channel.uniqueName, channel.sid);
        return channel;
    });
}

// createChannel('CH15cfee8ab66e4d1f95befdf3a8daa3eb')
// .catch(err => {
//     console.error(err.message);
// });



/**
 * Flow
 *  - create chat --> save chat sid 
 *  - create user --> save user sid
 */