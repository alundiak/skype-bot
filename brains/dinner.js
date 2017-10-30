module.exports = function(connector) {
    var builder = require('botbuilder');

    // This is a dinner reservation bot that uses multiple dialogs to prompt users for input.
    var bot = new builder.UniversalBot(connector, [
        function(session) {
            session.send("Welcome to the dinner reservation.");
            session.beginDialog('askForDateTime');
        },
        function(session, results) {
            session.dialogData.reservationDate = builder.EntityRecognizer.resolveTime([results.response]);
            session.beginDialog('askForPartySize');
        },
        function(session, results) {
            session.dialogData.partySize = results.response;
            session.beginDialog('askForReserverName');
        },
        function(session, results) {
            session.dialogData.reservationName = results.response;

            // Process request and display reservation details
            session.send(`Reservation confirmed. Reservation details: 
                     <br/>Date/Time: ${session.dialogData.reservationDate} 
                     <br/>Party size: ${session.dialogData.partySize} 
                     <br/>Reservation name: ${session.dialogData.reservationName}`);
            session.endDialog();
        }
    ]);

    // Dialog to ask for a date and time
    bot.dialog('askForDateTime', [
        function(session) {
            builder.Prompts.time(session, "Please provide a reservation date and time (e.g.: June 6th at 5pm)");
        },
        function(session, results) {
            session.endDialogWithResult(results);
        }
    ]);

    // Dialog to ask for number of people in the party
    bot.dialog('askForPartySize', [
        function(session) {
            builder.Prompts.text(session, "How many people are in your party?");
        },
        function(session, results) {
            session.endDialogWithResult(results);
        }
    ])

    // Dialog to ask for the reservation name.
    bot.dialog('askForReserverName', [
        function(session) {
            builder.Prompts.text(session, "Who's name will this reservation be under?");
        },
        function(session, results) {
            session.endDialogWithResult(results);
        }
    ]);

    return bot;
}
