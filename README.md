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
- [How to build skype bot with nodejs?](https://medium.com/@AmJustSam/how-to-build-skype-bot-with-nodejs-ddec8372114c) [medium.com]
- [A NodeJS chatbot tutorial – Part 1](https://blog.recast.ai/nodejs-bot-tutorial-1/) (Facebooks Aps, [Recast.AI](https://github.com/recastAI))


## Bot instance details
- Default url/host for messages listening/broadcasting - `http://localhost:3978/api/messages`
- `botbuilder` has built-in support for powerful AI frameworks such as LUIS.
- Emulator works ok locally with HTTP server, but on Heroku it requires HTTPS.
- Link ["Add Bot to Contacts"](https://join.skype.com/bot/d60d43ae-da6d-406a-8bcb-97bcb8e29cfe)

## NodeJS based Bot Examples
- https://github.com/kiramishima/acopiobot

## SSL Self-Signed Certificate 
- [Quick guide on how to set up a self-signed SSL certificate on Ubuntu](http://qugstart.com/blog/linux/quickest-way-to-create-a-self-signed-ssl-certificate-in-ubuntu/)
- [Node.js and RESTify Server with both HTTP and HTTPS](http://qugstart.com/blog/node-js/node-js-restify-server-with-both-http-and-https/)

## DirectLineJS, WebChat, backchannel
- npm module [botFramework-directLinejs](https://github.com/Microsoft/BotFramework-DirectLineJS)
- https://github.com/Microsoft/BotBuilder-Samples/tree/master/Node/core-DirectLine
- https://github.com/Microsoft/BotFramework-DirectLineJS
- https://github.com/ryanvolum/backChannelBot
- https://github.com/Microsoft/BotBuilder/issues/507. -note about headers using `beforeSend()`

## Bot Related Services
- [Bot Framework Portal](https://dev.botframework.com/) (where we have [My Bots](https://dev.botframework.com/bots) page)
- [Application Registration Portal](https://apps.dev.microsoft.com/#/appList) where we have applications listed
- [Dev WebControl Generator](https://dev.skype.com/webcontrol)
- [HTML code snippet builder](https://latest-swx.cdn.skype.com/lwc/sdk/0.0.835/index-builder.html)


## Curl
- https://docs.microsoft.com/en-us/bot-framework/troubleshoot-authentication-problems

```
curl -k -X POST https://login.microsoftonline.com/botframework.com/oauth2/v2.0/token -d "grant_type=client_credentials&client_id=APP_ID&client_secret=APP_PASSWORD&scope=https%3A%2F%2Fapi.botframework.com%2F.default"
```
works. but so what? No CORS?

- https://github.com/rlidwka/sinopia/issues/329

```
Creating a user
curl -s \ -H "Accept: application/json" \ -H "Content-Type:application/json" \ -X PUT --data '{"name": "username", "password": "password"}' \ http://registry/-/user/org.couchdb.user:username

Login existing user
curl -s \ -H "Accept: application/json" \ -H "Content-Type:application/json" \ -X PUT --data '{"name": "username", "password": "password"}' \ --user username:password \ http://registry/-/user/org.couchdb.user:username
```

- https://stackoverflow.com/questions/41832641/parsing-an-http-response-from-a-curl-post

```
curl -L -H 'X-Cisco-Meraki-API-Key: mykeygoeshere' -X POST -H'Content-Type: application/json' --data-binary '{"name":"'"$NETWORK_NAME"'", "type":"appliance", "timeZone":"'"$TIME_ZONE"'"}' 'https://dashboard.meraki.com/api/v0/organizations/foobar/networks'
```


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
- https://docs.microsoft.com/en-us/cli/azure/install-azure-cli?view=azure-cli-latest => `brew install azure-cli`


## CORS
- https://github.com/expressjs/cors fro NodeJS
- https://stackoverflow.com/questions/38317973/no-access-control-allow-origin-header-with-microsoft-online-auth
Looks like hosting on Heroku or from localhost resuires Azure deployment.
>Your not going to be able to run that from the client. Part of the CORS setup requires that microsoftonline.com adds your domain to their CORS supported whitelist. I would suggest that you make a call a service on your server, which then makes the request server to server. 

- https://github.com/Microsoft/BotBuilder/issues/3510
Looks like people use POST requests to `api/messages` URL.

- https://social.msdn.microsoft.com/Forums/sqlserver/en-US/443e15fc-241d-4158-a44c-4573a07f14e6/azure-ad-authentication-for-cors-requests?forum=windowsazurewebsitespreview

## Other
- Skype Bot using Python ad Skype4Py - https://github.com/opensourcehacker/sevabot
- Skype Bot using simple Python - https://github.com/puneetsngh/pythonSkypeBot
- Skype Bot using Java and Skype Kit (gone) - https://github.com/toomasr/skype-bot

## GitHub issues with my comments
- 
- https://github.com/Microsoft/BotBuilder/issues/3756 - Getting 400 "Bad Request" error when sending messages to Messenger channel
- https://github.com/Microsoft/BotBuilder/issues/507 - Error in Bot Framework Directline connector
- https://github.com/IdentityModel/oidc-client-js/issues/437 - looks like OpenID/IdentyModel doesn't support CORS

## Resources
- https://docs.microsoft.com/en-us/bot-framework/nodejs/bot-builder-nodejs-quickstart
- https://docs.microsoft.com/en-us/bot-framework/debug-bots-emulator
- https://chatbotslife.com/how-to-create-a-restaurant-chatbot-part-1-2021d4caec36
- https://cthakkar.wordpress.com/2016/06/11/bot-framework-bot-connector-features/
- https://stackoverflow.com/questions/40523254/how-to-get-conversation-details-in-microsoft-bot-framework-for-skype
- https://stackoverflow.com/questions/38317973/no-access-control-allow-origin-header-with-microsoft-online-auth
- https://tsmatz.wordpress.com/2016/08/19/build-skype-bot-with-microsoft-bot-framework-oauth-and-rest-api/
