const store = require('../database/firestore');
const twilioService = require('./twilio-service');

function registerHelper(request) {
    const { email } = request;
    
    return store.getUserByEmail(email)
    .then(user => {
        const userExists = !!user;
        const userId = userExists ? user._id : store.generateUserId();

        const userData = {
            _id: userId,
            ...request,
            name: request.name,
            email: request.email,
            phone: request.phone,
            canHelp: true
        };

        const ensureTwilioUser = userExists && user.twilio
            ? Promise.resolve(user.twilio.sid)
            : twilioService.ensureUser(userId, { name: userData.name, email: userData.email })
                .then(t => userData.twilio = { sid: t.sid });

        const saveToDb = userExists 
            ? () => store.updateUser(userId, userData)
            : () => store.createUser(userId, userData);

        return ensureTwilioUser.then(saveToDb);
    });
}

module.exports = {
    registerHelper
}
