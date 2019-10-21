import { Client } from 'twilio-chat';

/**
 * TODO: 
 *  - create private chats on server
 *  - give clients most limited user permissions
 */

function initChat(username, channelId, token, onMessage) {

    return Client.create(token).then(client => {
        console.log('chatClient initialized', client);

        return client.getSubscribedChannels().then(getSubscribedChannelsResult => {
            const { hasNextPage, hasPrevPage, items, nextPage, prevPage } = getSubscribedChannelsResult;
            /** TODO: paginate all channels and find out if user already joined */
            console.log('getSubscribedChannelsResult', getSubscribedChannelsResult);
            
            return client.getChannelByUniqueName(channelId).then(channel => {
                console.log('channel found', channel);
                return channel;
            }).catch(err => {
                console.log('channel not found, creating channel ...', err);
                return client.createChannel({
                    uniqueName: channelId,
                    friendlyName: 'Chat ' + channelId,
                    isPrivate: false  /** TODO: maybe should create private */
                });
            });

        }).then(channel => {
            channel.join().then(channel => {
                console.log('joined', channel);
            });

            channel.on('messageAdded', message => {
                console.log('messageAdded', message);
                const { author, body } = message;
                onMessage({ author, body });
            });

            window.channel = channel;
        }).catch(err => {
            console.error('err');
        });

    });
};

window.initChat = function(token) {
    return initChat('', 'my-channel-private', token, m => console.log(m));
}


export default initChat;
