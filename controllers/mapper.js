var fs        = require('fs');
var Converter = rootRequire('lib/converter');


function run(req, res) {
  console.log('Recieved request from', req.hostname);
  converter = new Converter();
  converter.load(req.param('name'), function(err) { });
  res.status(202).end();
}

function setup(app, models, connections) {
  app.post('/mapper/:name', run);
}

module.exports = setup;
