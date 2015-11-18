var express = require('express');
var bodyParser = require('body-parser');
var escape = require('html-escape');
var app = express();

var cfg = {
  port: process.env.PORT || 8080,
  hostname: process.env.IP || '127.0.0.1'
};

app.set('view engine', 'ejs');
// app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(express.static('public'));

var server = app.listen(cfg.port, cfg.hostname, function () {
  console.log('listening on ' + cfg.hostname + ':' + cfg.port);
});


/* "business logic" */
var messages = [];

function _formatString (str, truncateLength) {
  var truncateLength = truncateLength || 64;
  return escape(str).substring(0, truncateLength);
}

function addMessage (user, content) {
  messages.push({user: _formatString(user, 32), content: _formatString(content, 64)});
  if (messages.length > 20) {
    messages.shift();
  }
}


/* "api" */

app.post('/send', function (req, res) {
  if (req.body.user && req.body.content) {
    addMessage(req.body.user, req.body.content);
    res.end();
  } else {
    res.status(500).send('Something broke!');
  }
});

app.get('/messages', function (req, res) {
  res.send(messages);
});

app.get('/', function (req, res) {
  // res.render('index');
  res.render('instructions');
});
