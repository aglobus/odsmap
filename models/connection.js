var config = rootRequire('config');
module.exports = function(local, mongoose) {

  var schema = new mongoose.Schema({

    db_kind: {
      type: String,
      enum: config.supported_dbs,
      required: true
    },

    db_username: {
      type: String
    },

    db_password: {
      type: String
    },

    db_server: {
      type: String,
      required: true
    },

    db_port: {
      type: Number,
      required: true
    },

    db_name: {
      type: String,
      required: true,
    },

    name: {
      type: String,
      required: true,
      unique: true
    }

  });

  return local.model('Connection', schema, 'connection');
};
