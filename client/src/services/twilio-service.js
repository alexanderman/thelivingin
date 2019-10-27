import { Client } from 'twilio-chat';

class Connection {
    constructor(chatId, channel) {
        let listenerSet = false;
        this.listen = (onMessage) => {
            if (listenerSet) {
                throw new Error('listener already set');
            }
            listenerSet = true;
            channel.on('messageAdded', message => {
                console.log('twilio messageAdded', message);
                const { attributes, author, body, channel: { sid: channelSid } } = message;
                onMessage({ author, body, channelSid, chatId, attributes });
            });
        };
        this.sendMessage = (message, attributes) => {
            return channel.sendMessage(message, attributes);
        };

        /** workaround for readonly getters from private fields */
        this.__readonly = key => {
            if (key == 'channelSid') return channel.sid;
            if (key == 'chatId') return chatId;
        }
    }
    
    get chatId() { 
        return this.__readonly('chatId');
    }
    get channelSid() { 
        return this.__readonly('channelSid');
    }
}

/** chatId is our db chat id, channelSid id twilios channel sid */
export function createChannelConnection(chatId, channelSid, token) {
    console.log('twilio initializing client...');
    
    return Client.create(token).then(client => {
        console.log('twilio client initialized!');

        console.log('twilio finding channel by sid', channelSid);
        return client.getChannelBySid(channelSid).then(channel => {
            console.log('twilio channel found!');
            return channel;
        });
    }).then(channel => {
        return new Connection(chatId, channel);
    });
}
