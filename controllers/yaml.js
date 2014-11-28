var Yaml;
var fs = require('fs');
var js_yaml = require('js-yaml');

function uploadYaml(req, res) {
  var filename = req.files[Object.keys(req.files)].path;
  try {
    var doc = js_yaml.safeLoad(fs.readFileSync(filename, 'utf8'));
    Yaml.update({name: doc.name}, doc, {upsert: true}, function(err, yaml) {
      if (err) {
        console.log(err);
        res.status(500).end();
      }
      fs.unlink(filename, function(exception) {
        if (exception)
          console.log(exception);
      });
      res.status(200).end();
    });
  } catch(e) {
    console.log('Error loading YAML file', e);
    res.status(500).end();
  }
}

function setup(app, models) {
  Yaml = models.yaml;
  app.post('/yaml/upload', uploadYaml);
}

module.exports = setup;
