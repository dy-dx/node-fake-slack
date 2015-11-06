var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var cfg = {
  port: process.env.PORT,
  hostname: process.env.IP
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

function addMessage (user, content) {
  messages.push({user: user, content: content});
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
  res.render('index');
});
