module.exports = function(local, mongoose) {

  var schema = new mongoose.Schema({

    any: {}

  }, {strict: false});

  return local.model('Yaml', schema, 'yaml');
};
