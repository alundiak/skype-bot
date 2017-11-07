function setupSkypeBot() {
    var $sendToBot = $('#sendToBot');
    var $messageForBot = $('#messageForBot');

    $sendToBot.on('click', function() {
        var url = 'http://localhost:3978/api/messages';
        // var url = 'http://kanapka-bot.herokuapp.com/api/messages';

        var messageBody = {
            "content": $messageForBot.text(),
            "messagetype": "RichText",
            "contenttype": "text"
            // "composetime": "2017-11-06T19:58:31.749Z",
            // "clientmessageid": "1509998311749",
            // "Has-Mentions": "false",
            // "imdisplayname": "Andrii Lundiak"
        }

        // TODO: Use Fetch API
        $.ajax(url, {
            method: 'post',
            data: messageBody,
            crossorigin: true,
            success: function(a,b) {
                console.log(a,b)
            },
            error: function() {

            }
        });
    })
}

setupSkypeBot();