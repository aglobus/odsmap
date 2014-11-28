var mssql = require('mssql');

function connect(options, callback) {
  var config = {
    user: (options.db_username) ? options.db_username : '',
    password: (options.db_password) ? options.db_password: '',
    server: options.db_server,
    database: options.db_name,
    options: {
    }
  };
  var connection = new mssql.Connection(config, function(err) {
    if (err)
      console.log(err);
    callback(connection);
  });
};

function query(fields, table, callback) {
};

function get(db_options, fields, table, callback) {
};

module.exports = get;
