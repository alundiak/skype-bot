module.exports = function(connector) {
    var builder = require('botbuilder');

    // Create Alarm
    var bot = new builder.UniversalBot(connector, [
        function(session) {
            session.send("Welcome to the Alarm Setup Bot.");
            session.beginDialog('createAlarm');
        }
    ]);

    bot.dialog('createAlarm', [
        function(session) {
            session.dialogData.alarm = {};
            builder.Prompts.text(session, "What would you like to name this alarm?");
        },
        function(session, results, next) {
            if (results.response) {
                session.dialogData.name = results.response;
                builder.Prompts.time(session, "What time would you like to set an alarm for?");
            } else {
                next();
            }
        },
        function(session, results) {
            if (results.response) {
                session.dialogData.time = builder.EntityRecognizer.resolveTime([results.response]);
            }

            // Return alarm to caller  
            if (session.dialogData.name && session.dialogData.time) {
                session.endDialogWithResult({
                    response: {
                        name: session.dialogData.name,
                        time: session.dialogData.time
                    }
                });
            } else {
                session.endDialogWithResult({
                    resumed: builder.ResumeReason.notCompleted
                });
            }
        }
    ]);

    return bot;
}
