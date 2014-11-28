global.rootRequire = function(name) {
    return require(__dirname + '/' + name);
};

var express     = require('express');
var bodyParser  = require('body-parser');
var multer      = require('multer');

var config      = require('./config');

var dbs         = require('./lib/local_connections');
var models      = require('./models');

var app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(multer({dest: './tmp/'}));

[
  'connection',
  'yaml',
  'mapper',
  'cron'
].forEach(function(path) {
  require('./controllers/' + path)(app, models, dbs);
});

app.listen(config.express.port, config.express.ip, function(err) {
  if (err) {
    console.log('Unable to listen for connections', err);
    process.exit(1);
  }
  console.log('Listening on http://' + config.express.ip + ':' + config.express.port);
});
