//
// Restify Server
//
var builder = require('botbuilder');
var restify = require('restify');

const restifyServerPort = 3978;

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

// Listen for messages from users 
server.post('/api/messages', connector.listen());

// Receive messages from the user and respond by echoing each message back (prefixed with 'You said:')
var bot = new builder.UniversalBot(connector, function (session) {
    session.send("You said: %s", session.message.text);
});

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