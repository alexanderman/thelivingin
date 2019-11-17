/** 
 * connection service between buisness logic and twilio API
 */
const twilio = require('./index');
const store = require('../../database/firestore');

function sendSmsAddedToChat(userId, templateId, userChatUrl) {
    if (!userId || !templateId || !userChatUrl) {
        return Promise.reject(new Error('missing one of required parameters [userId, templateId, userChatUrl]'));
    }
    
    return Promise.all([
        store.getUserById(userId),
        store.getSmsTemplateById(templateId),
    ])
    .then(([user, smsTemplate]) => {
        if (!smsTemplate) {
            throw new Error(`sms template "${templateId}" was not found`);
        }
        if (!user) {
            throw new Error(`user with id "${userId}" was not found`);
        }

        const message = smsTemplate.text
            .replace(/\{\{user_name\}\}/gi, user.name)
            .replace(/\{\{chat_url\}\}/gi, userChatUrl);

        return twilio.sendSms(user.phone, message);
    })
    .then(msgResource => {
        const { sid } = msgResource;
        return Promise.all([
            store.registerSms(msgResource, userId),
            store.updateUser(userId, { 'last_notifications.sms': { sid, createdAt: Date.now() } })
        ]);
    })
    .then(() => {
        return store.getUserById(userId);
    });
}


module.exports = {
    sendSmsAddedToChat
}
