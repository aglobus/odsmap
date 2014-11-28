var config = rootRequire('config');

var db_types = config.supported_dbs;

function Connector() {

  var self = this;
  this.connections = {};
  db_types.forEach(function(path) {
    self.connections[path] = require('./' + path);
  });

}

Connector.prototype.get = function(db_options, query_options, sink) {

  var type = db_options.db_kind;

  if (!~db_types.indexOf(type) || typeof this.connections[type] != 'function') {
    console.log('Not a known database type');
    return;
  }

  this.connections[type](db_options, query_options, sink);

};

module.exports = exports = new Connector();
