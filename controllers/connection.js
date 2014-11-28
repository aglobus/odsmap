var Connection;

function createConnection(req, res) {
  var params = req.body;
  if (params.db_kind && params.db_server && params.db_port && params.db_name && params.name) {
    var schema = {
      db_kind: params.db_kind,
      db_server: params.db_server,
      db_port: params.db_port,
      db_name: params.db_name,
      db_username: params.db_username,
      db_password: params.db_password,
      name: params.name
    };
    Connection.update({name: params.name}, schema, {upsert: true}, function(err, connection) {
      if (err) {
        console.log(err);
        res.status(500).end();
      }
      res.status(201).end(); //200 or 201?
    });
  } else
    res.status(400).end();
}

function getConnection(req, res) {
  //Connection.findOne({name: req.param('name')}).exec(function(err, connection) {
  //});
}

function updateConnection(req, res) {
}

function deleteConnection(req, res) {
  Connection.remove({name: req.param('name')}, function(err) {
    if (err)
      console.log(err);
  });
  res.status(202).end();
}

function setup(app, models) {
  Connection = models.connection;
  app.post('/connection/', createConnection);
  //app.get('/connection/:id', getConnection);
  //app.put('/connection/:id', updateConnection);
  app.delete('/connection/:name', deleteConnection);
}

module.exports = setup;
