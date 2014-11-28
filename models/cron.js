module.exports = function(local, mongoose) {

  var schema = new mongoose.Schema({

    cron_string: {
      type: String,
      required: true
    },

    cron_options: {
      type: Object,
      required: false
    },

    yaml_name: {
      type: String,
      required: true
    }

  });

  return local.model('Cron', schema, 'cron');
};
