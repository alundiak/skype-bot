module.exports = function(connector) {
    var builder = require('botbuilder');

    var waterfalSteps = [
        function(session) {
            // step 1
        },
        function(session, results) {
            // step 2
        },
        function(session, results) {
            // step 3
        },
        function(session, results) {
            // step 3
        }
    ];

    var justSingleHandler = function (session) {
        session.sendTyping();
        // setTimeout(function () {
        //     session.send("Hello there...");
        // }, 3000);
    }


    // Bot Instance via UniversalBot constructor by 2nd param receive either:
    // waterfallSteps - aka dialogs by start
    // or empty array - meaning no steps - empty waterfall.
    // or function - single handler
    var bot = new builder.UniversalBot(connector, justSingleHandler);

    /*
        - Actions work in Group chat when mentioned @Kanapka and in private dialogs/chats, when just typed text
        - Dialogs work ONLY in private chats.
    */

    // https://docs.microsoft.com/en-us/bot-framework/nodejs/bot-builder-nodejs-handle-conversation-events
    bot.on('conversationUpdate', function(message) {
        console.log('\n===>>>\nMESSAGE\n===>>>\n');
        console.log(message);
        console.log('\n<<<===\nMESSAGE\n<<<===\n');

        console.log('\n<<<===\nCONVERSATION\n<<<===\n');
        console.log(message.address.conversation);
        console.log('\n<<<===\nCONVERSATION\n<<<===\n');

        var botId = message.address.bot.id;
        var isGroup = message.address.conversation.isGroup;
        var conversationIdBackup = message.address.conversation.id;

        // why message.membersAdded here when I restart localhost emulator or refresh page with DirectLine request?
        if (message.membersAdded && message.membersAdded.length > 0) {
            var filtered = message.membersAdded.filter(function(member){
                return member.id == botId
            })

            if (!filtered.length){
                return
            }

            console.log('\n<<<===\nCONVERSATION AFTER NEW ADD to the chat\n<<<===\n');
            console.log(message.address.conversation);
            console.log('\n<<<===\nCONVERSATION AFTER NEW ADD to the chat\n<<<===\n');

            // Say hello
            var txt = isGroup ? "Hello everyone!" : "Conversion updated... Members added: " + message.membersAdded[0].name;
            var reply1 = new builder.Message()
                .address(message.address)
                .text(txt);
            bot.send(reply1);

            var changedAddress = message.address;
            changedAddress.conversation = {
                isGroup: false,
                id: "29:1HTjE6Ul1MDfAzZcwrUrvAclC8pREzF_b8o9vRtvmHnI" // - Andrii Lundiak (lan_researcher)
                // id: '29:1DZUK5A5MG17YCBWOkFc_2zI_2nH9AyMkxO-gKoumDRI' // - Igor Tyshchenko (@igor.tyschenko)
            };
            var reply2 = new builder.Message()
                .address(changedAddress)
                .text('Kanapka bot added to new chat. CONVERSATION_ID: '+ conversationIdBackup);
            bot.send(reply2);

        } else if (message.membersRemoved) {
            // See if bot was removed
            message.text = "Goodbye."; // doesn't work
            for (var i = 0; i < message.membersRemoved.length; i++) {
                if (message.membersRemoved[i].id !== botId) {
                    var reply3 = new builder.Message()
                        .address(message.address)
                        .text("Goodbye. Kanapka will be missing you :("); // doesn't work
                    bot.send(reply3);
                    break;
                }
            }
        }
    });

    // // https://docs.microsoft.com/en-us/bot-framework/nodejs/bot-builder-nodejs-handle-conversation-events
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

    bot.on('typing', function (message) {
        console.log(message);
    });

    //
    // https://docs.microsoft.com/en-us/bot-framework/nodejs/bot-builder-nodejs-backchannel
    // https://github.com/Microsoft/BotFramework-WebChat/blob/master/samples/backchannel/index.html
    // https://github.com/ryanvolum/backChannelBot/blob/master/app.js
    // 
    //Creates a backchannel event
    const createEvent = (eventName, value, address) => {
        var msg = new builder.Message().address(address);
        msg.data.type = "event";
        msg.data.name = eventName;
        msg.data.value = value;
        return msg;
    }

    //Bot listening for inbound backchannel events - in this case it only listens for events named "buttonClicked"
    bot.on("event", function(message) {
        console.log("EVENT LISTENER 1", message);
        // var msg = new builder.Message().address(message.address);
        // msg.textLocale("en-us");
        // if (message.name === "buttonClicked") {
        //     msg.text("I see that you just pushed that button");
        // }
        // bot.send(msg);
    });

    //Basic root dialog which takes an inputted color and sends a changeBackground event. No NLP, regex, validation here - just grabs input and sends it back as an event. 
    bot.dialog(':custom', [
        function(session) {
            console.log(session.message)
            var reply = createEvent("changeBackground", session.message.text, session.message.address);
            session.endDialog(reply);
        }
    ]).triggerAction({
        matches: /^custom/i,
        onSelectAction: (session, args, next) => {
            console.log(session.message);
            session.beginDialog(":kanapka_face_detected");
            
        }
    });

    // TODO OTHER EVENTS

    // https://docs.microsoft.com/en-us/bot-framework/nodejs/bot-builder-nodejs-handle-conversation-events
    // from https://github.com/Microsoft/BotBuilder/blob/master/Node/snippets/basics-greetingUsers-firstRun.js
    // Add first run dialog
    bot.dialog(':firstRun', function(session) {
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
    bot.dialog(":kanapka_face_detected", function(session) {

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

    bot.dialog(':kanapka', function(session) {
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
            session.sendTyping();
            console.log(args);
            session.send("Do not write 'bad' words in chat :)");
        }
    });

    bot.on("event", function(message) {
        console.log("EVENT LISTENER 2", message);

        var msg = new builder.Message().address(message.address);
        console.log('MSG>>>>>>>>>>>>>>>>>>', msg);
        msg.textLocale("en-us");
        if (message.name === "alertSkypeChat") {
            msg.text("I'm very close...");
        }
        bot.send(msg);
    });

    bot.customAction({
        matches: /eat|food/gi,
        onSelectAction: (session, args, next) => {
            session.sendTyping();
            console.log('\n===>>>\nSESSION\n===>>>\n');
            console.log(session);
            console.log('\n<<<===\nSESSION\n<<<===\n');

            console.log('\n===>>>\nMESSAGE\n===>>>\n');
            console.log(session.message);
            console.log('\n<<<===\nMESSAGE\n<<<===\n');

            // var msgEvent = new builder.Message().address(session.message.address);
            // msgEvent.data.type = "event";
            // msgEvent.data.name = "alertSkypeChat";
            // msgEvent.data.value = 'testValue';
            // // looks like msgEvent.data will become message in event listener
            // session.send(msgEvent);

            // https://docs.botframework.com/en-us/node/builder/chat-reference/interfaces/_botbuilder_d_.imessage.html
            // In the reactive case the you should copy the address field from the incoming message to the outgoing message 
            // (if you use the Message builder class and initialize it with the session this will happen automatically) 
            // and then set the text or attachments. For proactive messages you’ll need save the address from the incoming message 
            // to an external storage somewhere. You can then later pass this in to UniversalBot.beginDialog() or copy it to an 
            // outgoing message passed to UniversalBot.send().
            // Composing a message to the user using the incoming address object will by default send a reply to the user in the 
            // context of the current conversation. Some channels allow for the starting of new conversations with the user. 
            // To start a new proactive conversation with the user simply delete the conversation field from the address object 
            // before composing the outgoing message.
            
            session.userData.addressBackup = session.message.address;
            console.log(session.userData.addressBackup);

            // if DirectLineJS,. then bot is different:
            //  bot: { id: 'kanapka@gUY0MKhYruE', name: 'Kanapka' },

            var changedAddress = session.message.address;
            changedAddress.channelId = 'skype';
            console.log("LOG !!!!!!!!!!!!!!!");
            console.log(changedAddress.conversation);
            console.log("LOG !!!!!!!!!!!!!!!");
            delete changedAddress.conversation;
            changedAddress.conversation = {
                isGroup: true,
                // id: "29:1HTjE6Ul1MDfAzZcwrUrvAclC8pREzF_b8o9vRtvmHnI" // - me
                // id: "19:8ee6791956ef48dfbbd69009c1c91f1b@thread.skype" // - chat Face PoC Devs
                id: '19:0e1910b63ba1476ab2b3706dc72cb0f2@thread.skype' // chat "bots"
            };
            changedAddress.user = { id: 'kanapka-brain-user', name: 'Kanapka Brain User' };
            changedAddress.bot = { id: '28:d60d43ae-da6d-406a-8bcb-97bcb8e29cfe', name: 'Kanapka' };

            var msg = new builder.Message().address(changedAddress);
            msg.text("This message sent by Skype Bot triggered by Dialog 'eat' with Bot via Kanapka Brain with hardcoded conversation.id");
            console.log('\nNEW MESSAGE\n');
            console.log(msg);
            console.log(msg.data.address);
            // msg.data.name = "alertSkypeChat";
            // msg.data.value = 'testValue';
            session.send(msg);
        }
    });

    // https://github.com/Microsoft/BotBuilder/blob/master/Node/snippets/basics-endingConversations.js
    bot.endConversationAction('goodbyeAction', "Ok... See you next time.", {
        matches: /^goodbye|bye/i
    });

    bot.customAction({
        matches: /help/gi,
        onSelectAction: function(session, args, next) {
            session.sendTyping();
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