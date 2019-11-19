before deploying to any environment, make sure config is correct

## Config
 - twilio keys
 - set `TWILIO_PHONE_NUMBER` - sms sender number
 - set `TWILIO_WEBHOOK` - for twilio sms status updates
 - set `CLIENT_CHAT_URL` - to send correct chat url in notifications

## After Deploy
 - make sure collection `roles` exists and points to existing users
 - make sure collection `sms_templates` exists
 