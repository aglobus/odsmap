var mongoose    = require('mongoose');
var connections = rootRequire('lib/local_connections');

var local = connections.local;

module.exports = (function() {
  return {

    connection  : require('./connection')(local, mongoose),
    yaml        : require('./yaml')(local, mongoose),
    cron        : require('./cron')(local, mongoose)
  };
})();
