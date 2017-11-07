module.exports = function(connector) {
    var builder = require('botbuilder');

    // This is a dinner reservation bot that uses multiple dialogs to prompt users for input.
    var bot = new builder.UniversalBot(connector, [
        function(session) {
            // console.log('1st step');

            // session.send("This is Kanapka Bot. Stay tuned! More will be soon :)");
            // session.beginDialog('askForDateTime');
        },
        function(session, results) {

        },
        function(session, results) {

        },
        function(session, results) {

        }
    ]);

    // from https://github.com/Microsoft/BotBuilder/blob/master/Node/snippets/basics-greetingUsers-firstRun.js
    // Add first run dialog
    bot.dialog('firstRun', function(session) {
        // Set firstRun flag to avoid being re-started every message.
        session.userData.firstRun = true;
        session.send("Hello :) I'm Kanapka Bot. I will update you regarding Pan(i) Kanapka arrival.").endDialog();
    }).triggerAction({
        onFindAction: function(context, callback) {
            // Only trigger if we've never seen user before
            if (!context.userData.firstRun) {
                // Return a score of 1.1 to ensure the first run dialog wins
                callback(null, 1.1);
            } else {
                callback(null, 0.0);
            }
        }
    });

    bot.dialog('kanapka', [
        function(session) {

            var customMessage = new builder.Message(session)
                .text("**Hello**!")
                .textFormat("markdown")
                .textLocale("en-us");

            // customMessage is Object - TODO research
            // builder.Prompts.text(session, "Yes?");
            session.send(customMessage);
        },
        function(session, results) {
            var userMessage = session.message.text;
            console.log(userMessage);
            console.log(results);
            // session.endDialogWithResult(results);
            session.send(`"${userMessage}" - it's u said, not me :)`)
            session.endDialog();
        }
    ]).triggerAction({
        matches: /^"Hey Kanapka"|kanapka:/i,
        onSelectAction: (session, args, next) => {
            console.log(args);
            // Add the help dialog to the top of the dialog stack 
            // (override the default behavior of replacing the stack)
            session.beginDialog(args.action, args);
            // temporary
            // session.endDialog(args.action, args);
        }
    });;

    bot.dialog('help', function(session, args, next) {
        //Send a help message
        // TODO
        // 
        var str = `Global help menu.
            <br/> - "Hey Kanapka?" or "kanapka:" are phrases to trigger Bot Kanapka.
            <br/> - "help" prints this helpfull list.
            <br/> - "wtf" just a cursing checker.
            `;
        session.endDialog(str);
        // TODO
    }).triggerAction({
        matches: /^help$/i,
        onSelectAction: (session, args, next) => {
            console.log(args);
            // Add the help dialog to the top of the dialog stack 
            // (override the default behavior of replacing the stack)
            session.beginDialog(args.action, args);
            // temporary
            // session.endDialog(args.action, args);
        }
    });

    bot.customAction({
        matches: /wtf|wtf?/gi,
        onSelectAction: (session, args, next) => {
            session.send("Do not write 'bad' words in chat :)");
        }
    })

    return bot;
}