import { Client } from 'twilio-chat';

/** http://media.twiliocdn.com/sdk/js/chat/releases/3.3.1/docs/ */
class Connection {
    constructor(chatId, channel) {
        let listenerSet = false;
        let pager = null;
        const pageSize = 20;

        this.listen = (onMessage) => {
            if (listenerSet) {
                throw new Error('listener already set');
            }
            listenerSet = true;
            channel.on('messageAdded', message => {
                console.log('twilio messageAdded', message);
                const { index, attributes, author, body, channel: { sid: channelSid } } = message;
                onMessage({ author, body, channelSid, chatId, attributes, index });
            });
        };
        this.sendMessage = (message, attributes) => {
            return channel.sendMessage(message, attributes);
        };

        this.getPreviousMessages = () => {
            if (!pager) {
                return channel.getMessages(pageSize).then(pgr => {
                    pager = pgr;
                    return pager.items;
                });
            }
            if (pager.hasPrevPage) {
                return pager.prevPage().then(pgr => {
                    pager = pgr;
                    return pager.items;
                });
            }
            return Promise.resolve([]);
        }

        /** workaround for readonly getters from private fields */
        this.__readonly = key => {
            if (key === 'channelSid') return channel.sid;
            if (key === 'chatId') return chatId;
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
            window._channel = channel;
            return channel;
        });
    }).then(channel => {
        return new Connection(chatId, channel);
    });
}
