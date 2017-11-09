//
// ExpressJS server
//
var path = require('path')
var bodyParser = require('body-parser')
var http = require('http');
var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/'));

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.get('/', function(request, response) {
    response.sendFile(path.join(__dirname + '/index.html'));
});

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});

// var httpServer = http.createServer(app);
// httpServer.listen(app.get('port'), function() {
//     require('dns').lookup(require('os').hostname(), function(err, ipAddress, fam) {
//         // doesn't work on MacOS - TODO
//         // console.log(err);
//         let port = app.get('port');
//         console.log(`Node app is running => http://${ipAddress}:${port}`);
//     })
// });
