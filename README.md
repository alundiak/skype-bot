NodeJS based Skype bot to create activity in chats
===

## Main NodeJS Dependencies 
- [botbuilder](https://github.com/Microsoft/BotBuilder)
- [restify](https://github.com/restify/node-restify)


## Emulator (for dev/test mode)
- [BotFramework Emulator](https://github.com/Microsoft/BotFramework-Emulator)
- Despite the fact URL to Skype Bot is with `https` in Bots Management, Emulator uses `http` and then together with `ngrok` it works.


## If Behind Firewall (optional)
- Read first this `https://github.com/Microsoft/BotFramework-Emulator/wiki/Tunneling-(ngrok)`
- Download and install https://ngrok.com/download


## BotBuilder with NodeJS
- [Bot Builder SDK for Node.js](https://docs.microsoft.com/en-us/bot-framework/nodejs/bot-builder-nodejs-overview)
- [NodeJS example of `app.js`](https://github.com/Microsoft/BotBuilder/blob/master/Node/examples/demo-skype/app.js) for Bot working with Skype.


## Bot instance details
- Default url/host for messages listening/broadcasting - `http://localhost:3978/api/messages`
- `botbuilder` has built-in support for powerful AI frameworks such as LUIS.
- Emulator works ok locally with HTTP server, but on Heroku it requires HTTPS.

## SSL Self-Signed Certificate 
- [Quick guide on how to set up a self-signed SSL certificate on Ubuntu](http://qugstart.com/blog/linux/quickest-way-to-create-a-self-signed-ssl-certificate-in-ubuntu/)
- [Node.js and RESTify Server with both HTTP and HTTPS](http://qugstart.com/blog/node-js/node-js-restify-server-with-both-http-and-https/)


## Bot Related Services
- [Bot Framework Portal](https://dev.botframework.com/) (where we have [My Bots](https://dev.botframework.com/bots) page)
- [Application Registration Portal](https://apps.dev.microsoft.com/#/appList) where we have applications listed
- [Dev WebControl Generator](https://dev.skype.com/webcontrol)
- [HTML code snippet builder](https://latest-swx.cdn.skype.com/lwc/sdk/0.0.835/index-builder.html)

## Deployment to Heroku
- Locally, to works with http, but on remote Heroku instance, it requires https, to be called from Skype API.
- Do not hardcode port in nodejs server js file, use `process.env.PORT`, which is kinda required to use on Heroku, due to errors like:
>[`Web process failed to bind to $PORT within 60 seconds of launch`](https://stackoverflow.com/questions/31092538/heroku-node-js-error-r10-boot-timeout-web-process-failed-to-bind-to-port-w)
- If u use process.env.PORT, then Heroku https URL will NOT need append port value. Heroku applies SSL certificate from heroku.com.

- [how to handle HTTP and HTTPS?](https://stackoverflow.com/questions/13186134/node-js-express-and-heroku-how-to-handle-http-and-https)
- [HTTPS + SSL on Heroku - Node + Express](https://stackoverflow.com/questions/25148507/https-ssl-on-heroku-node-express)
>When SSL (https) traffic comes in, it is "stopped" (terminated) at the server. That server opens a new http connection to your dyno, and whatever is gets it sends back over https to the client. So on your dyno you don't need to "mess" with certs etc, and you will be seeing only incoming http traffic: whether directly from http clients, or from Heroku servers who talk https to clients and http to you.
- If no ngrok, then POST request to Heroku goes, but with error on server: `Error: connect ECONNREFUSED 127.0.0.1:64649`

## Azure based things
- [Azure](https://portal.azure.com/)
- https://docs.microsoft.com/en-us/bot-framework/deploy-bot-github

## Other
- Skype Bot using Python ad Skype4Py - https://github.com/opensourcehacker/sevabot
- Skype Bot using simple Python - https://github.com/puneetsngh/pythonSkypeBot
- Skype Bot using Java and Skype Kit (gone) - https://github.com/toomasr/skype-bot

## Resources
- https://docs.microsoft.com/en-us/bot-framework/nodejs/bot-builder-nodejs-quickstart
- https://docs.microsoft.com/en-us/bot-framework/debug-bots-emulator
- https://chatbotslife.com/how-to-create-a-restaurant-chatbot-part-1-2021d4caec36