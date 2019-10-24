import { Client } from 'twilio-chat';

class Connection {
    constructor(channel) {
        let listenerSet = false;
        this.listen = (onMessage) => {
            if (listenerSet) {
                throw new Error('listener already set');
            }
            listenerSet = true;
            channel.on('messageAdded', message => {
                console.log('twilio messageAdded', message);
                const { author, body, channel: { sid: channelSid } } = message;
                onMessage({ author, body, channelSid });
            });
        };
        this.sendMessage = (message) => {
            return channel.sendMessage(message);
        };
    }
}

export function createChannelConnection(channelSid, token) {
    console.log('twilio initializing client...');
    
    return Client.create(token).then(client => {
        console.log('twilio client initialized!', client);

        console.log('twilio finding channel by sid', channelSid);
        return client.getChannelBySid(channelSid).then(channel => {
            console.log('twilio channel found!');
            return channel;
        });
    }).then(channel => {

        return new Connection(channel);

    }).catch(console.error);
}



