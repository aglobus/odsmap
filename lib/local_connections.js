var config        = rootRequire('config');
var mongoose      = require('mongoose');

var connections   = null;

function connectionError(err) {
  console.log(err);
}

exports = module.exports = (function() {

  if (!connections) {
    connections = {};

    var nExpectedDbs = Object.keys(config.mongodb.dbs).length;

    for (var index in config.mongodb.dbs) {

      var db = config.mongodb.dbs[index];
      var connection = mongoose.createConnection('mongodb://' + config.mongodb.host + '/' + db);

      connections[index] = connection;

      connection.on('error', connectionError);

    }

  }

  return connections;
})();
