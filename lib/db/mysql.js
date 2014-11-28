var Knex = require('knex');

var knex;

function connect(options, callback) {
  if (!knex) {
    knex = Knex({
      client: 'mysql',
      connection: {
        host: options.db_server,
        user: (options.db_username) ? options.db_username : '',
        password: (options.db_password) ? options.db_password: '',
        database: options.db_name,
        charset: 'utf8'
      }
    });
  }
  callback();
}

function query(options, sink) {
  var fields = options.fields;
  var table = options.table;
  var limit = options.limit;
  var offset = options.offset;
  var restrict = options.restrict;

  var stream = knex.select(fields).from(table);//.limit(limit).offset(offset);

  if (restrict) {
    var on = restrict.on;
    var range = [restrict.between, restrict.to];
    stream = stream.whereBetween(on, range);
  }
  stream.pipe(sink);
}

function get(db_options, query_options, sink) {
  connect(db_options, function() {
    query(query_options, sink);
  });
}

module.exports = get;
