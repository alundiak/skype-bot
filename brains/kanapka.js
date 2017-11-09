module.exports = function(connector) {
    var builder = require('botbuilder');

    // This is a dinner reservation bot that uses multiple dialogs to prompt users for input.
    var bot = new builder.UniversalBot(connector, [
        /*
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

                }*/
    ]);

    /*
        - Actions work in Group chat when mentioned @Kanapka and in private dialogs/chats, when just typed text
        - Dialogs work ONLY in private chats.
    */

    // https://docs.microsoft.com/en-us/bot-framework/nodejs/bot-builder-nodejs-handle-conversation-events
    bot.on('conversationUpdate', function(message) {
        console.log(message);
        if (message.membersAdded && message.membersAdded.length > 0) {
            // Say hello
            var isGroup = message.address.conversation.isGroup;
            console.log('IS GROUP: ' + isGroup);
            var txt = isGroup ? "Hello everyone!" : "Hi... I'm Back from restart.";
            var reply = new builder.Message()
                .address(message.address)
                .text(txt);
            bot.send(reply);
        } else if (message.membersRemoved) {
            // See if bot was removed
            var botId = message.address.bot.id;
            for (var i = 0; i < message.membersRemoved.length; i++) {
                if (message.membersRemoved[i].id === botId) {
                    // Say goodbye
                    var reply = new builder.Message()
                        .address(message.address)
                        .text("Goodbye. Kanapka will be missing you :(");
                    bot.send(reply);
                    break;
                }
            }
        }
    });

    // https://docs.microsoft.com/en-us/bot-framework/nodejs/bot-builder-nodejs-handle-conversation-events
    bot.on('contactRelationUpdate', function(message) {
        console.log(message);
        if (message.action === 'add') {
            var name = message.user ? message.user.name : null;
            var reply = new builder.Message()
                .address(message.address)
                .text("Hello %s... Thanks for adding me.", name || 'there');
            bot.send(reply);
        }
    });

    // TODO OTHER EVENTS

    // https://docs.microsoft.com/en-us/bot-framework/nodejs/bot-builder-nodejs-handle-conversation-events
    // from https://github.com/Microsoft/BotBuilder/blob/master/Node/snippets/basics-greetingUsers-firstRun.js
    // Add first run dialog
    bot.dialog('firstRun', function(session) {
        // Set firstRun flag to avoid being re-started every message.
        session.userData.firstRun = true;
        session.send("Hello :) I'm Kanapka Bot. I will update you about Pan(i) Kanapka arrival.").endDialog();
    }).triggerAction({
        onFindAction: function(context, callback) {
            // Only trigger if we've never seen user before
            // In practice, when develop, and restart user, it's always when new session object created.
            if (!context.userData.firstRun) {
                // Return a score of 1.1 to ensure the first run dialog wins
                callback(null, 1.1);
            } else {
                callback(null, 0.0);
            }
        }
    });

    //root dialog
    bot.dialog("/kanapka_face_detected", function(session) {

        // ideally, we may receive channelId=skype, conversationId=TBD from Python, 
        // and it should be in session.userData or session.state

        console.log("-------------------------------------------------");
        console.log("Bot Received Remote Message at '/kanapka_face_detected' dialogue endpoint: ");

        console.log(session.message);

        //detect Skype message here
        if (session.message.address.channelId === "skype") {
            session.send("Skype message recognized!");
            // session.beginDialog("/send_skype_message");
            // HERE MUST be code, defining message to Conversation by chanellId, conversationId, and just send, no dialog, no reply

        } else {
            session.send("Channel other than Skype recognized.");
        }

    });

    bot.dialog('/kanapka', function(session) {
        var customMessage = new builder.Message(session)
            .text("**kanapka is in progress**!")
            .textFormat("markdown")
            .textLocale("en-us");

        // customMessage is Object - TODO research
        session.send(customMessage);
        session.endDialog();
    }).triggerAction({
        matches: /^where is my kanapka?/i,
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
            console.log(args);
            session.send("Do not write 'bad' words in chat :)");
        }
    });

    bot.customAction({
        matches: /eat|food/gi,
        onSelectAction: (session, args, next) => {
            console.log('\n===>>>\nSESSION\n===>>>\n');
            console.log(session);
            console.log('\n<<<===\nSESSION\n<<<===\n');

            console.log('\n===>>>\nMESSAGE\n===>>>\n');
            console.log(session.message);
            console.log('\n<<<===\nSESSION\n<<<===\n');

            session.send("Maybe order kanapka?");
        }
    });

    // https://github.com/Microsoft/BotBuilder/blob/master/Node/snippets/basics-endingConversations.js
    bot.endConversationAction('goodbyeAction', "Ok... See you next time.", {
        matches: /^goodbye|bye/i
    });

    bot.customAction({
        matches: /help/gi,
        onSelectAction: function(session, args, next) {
            console.log(session);

            // there is "firstRun" initial dialog/action upon starting server/session or add bot to chat. EXPERIMENTAL. Not stable.
            var str = `Kanapka Help menu.
                <br/>Actions:
                <br/> - "help" prints this helpfull list.
                <br/> - "eat" and "food" are funny keywords.
                <br/> - "wtf" just a cursing checker.
                <br/> - "goodbye" or "bye" just a cursing checker.
                <br/>Dialogs:
                <br/> - "where is my kanapka?"" planned to be as request for time delivery or order. Future feature..
                `;
            session.send(str);
        }
    });

    return bot;
}