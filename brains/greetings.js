module.exports = function(connector) {
	var builder = require('botbuilder');

    // Ask the user for their name and greet them by name.
    var bot = new builder.UniversalBot(connector, [
        function(session) {
            session.send("Welcome to the Greetings Bot.");
            session.beginDialog('greetings');
        }
    ]);

    bot.dialog('greetings', [
        function(session) {
            session.beginDialog('askName');
        },
        function(session, results) {
            session.endDialog(`Hello ${results.response}!`);
        }
    ]);

    bot.dialog('askName', [
        function(session) {
            builder.Prompts.text(session, 'Hi! What is your name?');
        },
        function(session, results) {
            session.endDialogWithResult(results);
        }
    ]);

    return bot;
};
