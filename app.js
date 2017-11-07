//
// Restify Server
//
var http = require('http');
var https = require('https');
var fs = require('fs');

var builder = require('botbuilder');
var restify = require('restify');
var BotBrain = require('./brains/index');

var isProd = process.env.NODE_ENV === 'production';
var hostName = isProd ? 'kanapka-bot.herokuapp.com' : 'localhost';

// key: fs.readFileSync('./ssl_self_signed/server.key'),
// key: fs.readFileSync('./var2/key.pem'),
var keyFile = fs.readFileSync(`./ssl/${hostName}.key`);

// certificate: fs.readFileSync('./ssl_self_signed/server.crt')
// certificate: fs.readFileSync('./var2/ssl.crt')
var certFile = fs.readFileSync(`./ssl/${hostName}.cert`);

// var restifyServerPort = process.env.BOT_PORT || process.env.PORT || 3978;
var restifyServerPort = process.env.PORT || 3978;
// Using BOT_PORT (3978) doesn't work on Heroku. It throws error, when real communication starts:
// => dyno= connect= service= status=503 bytes= protocol=https
// => Web process failed to bind to $PORT within 60 seconds of launch
// That is why, maybe better to use process.env.PORT, which is random per Heroku (on localhost it's random also)
// var restifyHttpsServerPort = 8443; 
var restifyHttpsServerPort = process.env.PORT || 8443;
// var restifyHttpsServerPort = process.env.BOT_HTTPS_PORT || process.env.PORT || 8443;

// Setup HTTP Restify Server
var server = restify.createServer({
    name: 'skype-bot-http',
    version: '1.0.0'
});

// var server = http.createServer({// doesn't work, due to errors
//     name: 'skype-bot-http',
//     version: '1.0.0'
// });

// Setup HTTPS Restify Server
// var httpsServer = restify.createServer({
//     name: 'skype-bot-https',
//     version: '1.0.0',
//     key: keyFile,
//     certificate: certFile, // this way, server.url is HTTPS and HTTPS works good.
//     _httpsServerOptions: {
//         key: keyFile,
//         cert: certFile // this way, server.url is HTTP and HTTPS server works in fact
//         // certificate: certFile // this way, server.url is HTTP BUT HTTPS server doesn't work => ERR_SSL_VERSION_OR_CIPHER_MISMATCH
//     }
// });

// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});


var youSaidLogic = function(session) {
	// console.log(session);
    session.send("You said: %s", session.message.text);
};

// Receive messages from the user and respond by echoing each message back (prefixed with 'You said:')
var bot = new BotBrain(connector);


// Listen for messages from users 
server.post('/api/messages', connector.listen());
// httpsServer.post('/api/messages', connector.listen());

var setup_server = function(app) {
    function respond(req, res, next) {
    	console.log('respond CALL', req.params);
        res.send('I see you ' + req.params.name);
    }

    console.log('setup_server CALL');
    // Routes
    app.get('/test/:name', respond);

    // app.get('/', function(request, response) {
    //     response.sendFile(path.join(__dirname + '/index.html'));
    // });
}
setup_server(server);
// setup_server(httpsServer);


server.listen(restifyServerPort, function() {
    // console.log(server);
    console.log('%s listening to %s', server.name, server.url);
});

// httpsServer.listen(restifyHttpsServerPort, function() {
//     // console.log(httpsServer);
//     console.log('%s listening to %s', httpsServer.name, httpsServer.url);
// });
