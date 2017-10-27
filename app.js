//
// Restify Server
//
var builder = require('botbuilder');
var restify = require('restify');

// var restifyServerPort = process.env.BOT_PORT || process.env.PORT || 3978;
// Using BOT_PORT (3978) doesn't work on Heroku. It throws error, when real communication starts:
// => dyno= connect= service= status=503 bytes= protocol=https
// => Web process failed to bind to $PORT within 60 seconds of launch
// That is why, maybe better to use process.env.PORT, which is random per Heroku (on localhost it's random also)
var restifyServerPort = process.env.PORT; 

// Setup Restify Server
var server = restify.createServer();
server.listen(restifyServerPort, function () {
   console.log('%s listening to %s', server.name, server.url); 
});

// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

// Receive messages from the user and respond by echoing each message back (prefixed with 'You said:')
var bot = new builder.UniversalBot(connector, function (session) {
    session.send("You said: %s", session.message.text);
});

// Listen for messages from users 
server.post('/api/messages', connector.listen());

// bot.dialog('greetings', [
//     function (session) {
//         session.beginDialog('askName');
//     },
//     function (session, results) {
//         session.endDialog(`Hello ${results.response}!`);
//     }
// ]);

// bot.dialog('askName', [
//     function (session) {
//         builder.Prompts.text(session, 'Hi! What is your name?');
//     },
//     function (session, results) {
//         session.endDialogWithResult(results);
//     }
// ]);