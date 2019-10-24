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
                console.log('messageAdded', message);
                const { author, body } = message;
                onMessage({ author, body });
            });
        };
        this.sendMessage = (message) => {
            return channel.sendMessage(message);
        };
    }
}

function createChannelConnection(channelSid, token, onMessage = () => {}) {
    console.log('initializing client...');
    
    return Client.create(token).then(client => {
        console.log('client initialized!', client);

        console.log('finding channel by sid', channelSid);
        return client.getChannelBySid(channelSid).then(channel => {
            console.log('channel found!');
            return channel;
        });
    }).then(channel => {

        return new Connection(channel);

    }).catch(console.error);
}


export default createChannelConnection;
