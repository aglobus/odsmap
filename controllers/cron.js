var Cron;

function createCron(req, res) {
  var params = req.body;
  var schema = {
    cron_string: params.cron_string,
    cron_options: (params.cron_options) ? params.cron_options : null,
    yaml_name: params.yaml_name
  };
  Cron.create(schema, function(err, cron) {
    if (err) {
      console.log(err);
      res.status(500).end();
    }
    res.status(201).end();
  });
}

function setup(app, models, connections) {
  Cron = models.cron;

  app.post('/cron/', createCron);
}

module.exports = setup;
