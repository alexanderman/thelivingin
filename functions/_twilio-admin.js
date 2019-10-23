const config = require('./config').twilio;
const Twilio = require('twilio');
const client = Twilio(config.accountSid, config.authToken);

/** file to run locally only */

const args = process.argv.slice(2);

if (!args.length) {
    console.log('missing arguments in format key=val');
    process.exit();
}

const deleteChannels = async (val) => {
    if (val == 'ALL') {
        const channelInfoList = await client.chat.services(config.chatServiceId).channels.list({ limit: 10 });
        const proms = [];
        channelInfoList.forEach((channelInfo) => proms.push(client.chat.services(config.chatServiceId).channels(channelInfo.sid).fetch()));
        
        const channels = await Promise.all(proms);
        const remProms = [];
        channels.forEach(channel => {
            console.log('deleting channel', channel.sid);
            remProms.push(channel.remove());
        });
        
        await Promise.all(remProms);
        console.log(`${remProms.length} channels were deleted`);
    }
}

const deleteUsers = async (val) => {
    if (val == 'ALL') {
        const users = await client.chat.services(config.chatServiceId).users.list({ limit: 10 });
        const proms = [];
        users.forEach(user => { 
            console.log('deleting user', user.sid);
            proms.push(user.remove())
        });
        await Promise.all(proms);
        console.log(`${proms.length} users were deleted`);
    }
}

args.forEach(async arg => {
    const key = arg.split('=')[0];
    const val = arg.split('=')[1];

    switch (key) {

        case 'delete-channels': 
            return await deleteChannels(val);

        case 'delete-users': 
            return await deleteUsers(val);

    }

});

