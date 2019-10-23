const config = require('../../config').twilio;
const Twilio = require('twilio');
const client = Twilio(config.accountSid, config.authToken);
/** https://www.twilio.com/docs/chat/rest/user-resource */

function getUsers() {
    return client.chat.services(config.chatServiceId)
    .users.list({ limit: 20 })
    .then(users => {
        users.forEach(user => {
            console.log(user.sid, user.identity, user.friendlyName, user.roleSid);
        });
        return users;
    });
}

/** sid or identity */
function getUser(sid) {
    return client.chat.services(config.chatServiceId)
    .users(sid).fetch()
    .then(user => {
        console.log(user.sid, user.identity, user.friendlyName, user.roleSid);
        return user;
    });
}

function createUser(identity, attributesData) {
    const attributes = attributesData ? JSON.stringify(attributesData) : undefined;
    return client.chat.services(config.chatServiceId)
    .users.create({ identity, roleSid: config.userDeploymentRoleId, attributes })
    .then(user => {
        console.log(user.sid, user.identity, user.friendlyName, user.roleSid);
        return user;
    });
}

function addMember(identity) {
    return client.chat.services(config.chatServiceId)
    .channels('CH45fd4878e7c94e8e8813ffa8a2476e18')
    .members.create({ identity, roleSid: config.userChannelRoleId })
    .then(member => {
        console.log(JSON.stringify(member));
        return member;
    });
}

function getRoles() {
    return client.chat.services(config.chatServiceId)
    .roles.list({ limit:20 })
    .then(roles => {
       roles.forEach(role => {
            console.log(role.sid, role.friendlyName);
       });
       return roles;
    });
}

/** add member using identity */
// addMember('server-user-2')
// .catch(handleTwilioError);

/** add member using user SID */
// addMember('US762a661805d34b819a2b899147341bbf')
// .catch(handleTwilioError);

// getRoles()
// .catch(err => {
//     console.error(err);
// })

// getUser('US8f055fbe8c3642a480f734b7c9da5c1d')
// .catch(handleTwilioError);

// createUser('server-user-3', { email:'user3@server.com' })
// .catch(err => {
//     console.error(err);
// });


function handleTwilioError(err) {
    /** https://www.twilio.com/docs/api/errors */
    console.error(err);
    if (err.code == 20404) {
        console.log('handle not found');
    }
};
