// Example express application adding the parse-server module to expose Parse
// compatible API routes.

var express = require('express');
var ParseServer = require('parse-server').ParseServer;
var path = require('path');

var databaseUri = process.env.DATABASE_URI || process.env.MONGODB_URI;

if (!databaseUri) {
  console.log('DATABASE_URI not specified, falling back to localhost.');
}

var api = new ParseServer({
  databaseURI: databaseUri || 'mongodb://heroku_6w7qtgv5:tu4bui6sohd73mahf69mp1elvu@ds129720.mlab.com:29720/heroku_6w7qtgv5',
  cloud: process.env.CLOUD_CODE_MAIN || __dirname + '/cloud/main.js',
  appId: process.env.APP_ID || '6AfkpaA322EaTaYtJaUkGTaoAzuBAV36QUqKWfqT8U8k3ihVugGTEFYFBBaKEF8U',
  clientKey: process.env.CLIENT_KEY || 'afrpJhMZpgfs6JURsC6umhTptQ9D6qKRtBZ7ZBXVeshie48hzwbZv32fWo8jToeM', //Add your master key here. Keep it secret!
  masterKey: process.env.MASTER_KEY || 'DB3NVbHVyDNuZmbw3vCJeaMqgYHepM8y3To6UX7ejQ2qjuqG89YsuYfFbV2ECawz', //Add your master key here. Keep it secret!
  serverURL: process.env.SERVER_URL || 'http://ioliwerapiserver.herokuapp.com/parse',  // Don't forget to change to https if needed
  liveQuery: {
    classNames: ["Posts", "Comments"] // List of classes to support for query subscriptions
  }
});
// Client-keys like the javascript key or the .NET key are not necessary with parse-server
// If you wish you require them, you can set them as options in the initialization above:
// javascriptKey, restAPIKey, dotNetKey, clientKey

var app = express();

// Serve static assets from the /public folder
app.use('/public', express.static(path.join(__dirname, '/public')));

// Serve the Parse API on the /parse URL prefix
var mountPath = process.env.PARSE_MOUNT || '/parse';
app.use(mountPath, api);

// Parse Server plays nicely with the rest of your web routes
app.get('/', function(req, res) {
  res.status(200).send('This is just a shell...');
});

// There will be a test page available on the /test path of your server url
// Remove this before launching your app
app.get('/test', function(req, res) {
  res.sendFile(path.join(__dirname, '/public/test.html'));
});

var port = process.env.PORT || 1337;
var httpServer = require('http').createServer(app);
httpServer.listen(port, function() {
    console.log('parse-server-example running on port ' + port + '.');
});

// This will enable the Live Query real-time server
ParseServer.createLiveQueryServer(httpServer);