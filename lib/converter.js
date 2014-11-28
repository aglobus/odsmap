var concat        = require('concat-stream');
var async         = require('async');
var mongoose      = require('mongoose');
//var EventEmitter  = require('events').EventEmitter;

var dbs           = require('./db');
var config        = rootRequire('config');

var localDb       = require('./local_connections');
var models        = rootRequire('models');

//var emitter = new EventEmitter();

var Converter = function() {
  if (!(this instanceof Converter))
    return new Converter();
};

Converter.prototype.load = function(name, callback) {
  models.yaml.findOne({name: name}, function(err, result) {
    if (err)
      callback(err);

    if (!result)
      callback(new Error('Document empty'));

    var doc = result.toJSON();

    load(doc, function() {

      var fact = doc.map.fact;
      var dimensions = doc.map.dimensions;

      async.each(dimensions, function(dimension, next) {

        var key = dimension.key;

        var indexObj = {};
        indexObj[key] = 1; //ensure index on key

        var schema = new mongoose.Schema().index(indexObj);

        var dimModel = localDb.tmp.model('', schema, dimension.database + '.' + dimension.name);
        var factModel = localDb.tmp.model('', schema, fact.database + '.' + fact.name);

        join(key, factModel, dimModel, next);

      }, function(err) {
        console.log('Finished');
        callback(err);
      });

    });
  });
};

function join(key, factModel, dimModel, cb) {
  var map = function() {
    var obj = this.toJSON();
    delete obj._id;
    reduce(obj[key], obj);
  };

  var reduce = function(k, v) {
    var query = {};
    query[key] = k;

    var update = {};
    var u = {};
    u[key] = v;
    update.$set = u;

    factModel.collection.update(query, update, {multi: true}, function(err) {
      if (err)
        console.log(err);
    });
  };

  var stream = dimModel.find().stream();

  stream.on('data', function(doc) {
    map.apply(doc);

  }).on('close', cb);

}

function load(doc, callback) {
  var fact       = doc.map.fact;
  var dimensions = doc.map.dimensions;
  var self       = this;

  async.parallel(
    [

    function(callback) { //load fact table
      loadFact.call(self, fact, callback);
    },

    function(callback) { //load dimensions
      loadDimensions.call(self, dimensions, callback);
    }

    ], function(err, results) {

    if (err)
      console.log(err);

    callback();
  });
}

function fields(fields_obj, key) {
  if (!fields_obj)
    return '*';

  var ret = [];

  fields_obj.forEach(function(field_obj) {

    if (field_obj.name)
      ret.push(field_obj.name);

  });

  if (key && ret.indexOf(key) === -1)
    ret.push(key); //make sure key is always included

  return ret;
}

function aliases(fields_obj) {
  if (!fields_obj)
    return null;

  var ret = {};

  fields_obj.forEach(function(field_obj) {

    if (field_obj.alias && field_obj.name)
      ret[field_obj.name] = field_obj.alias;

  });
  return ret;
}

function loadDimensions(dimensions, callback) {
  async.each(dimensions, function(item, next) {

    var f = fields(item.fields, item.key);
    var context = {
      table_name    : item.name,
      database_name : item.database,
      fields        : f
    };

    get(context, function(resultModel) {

      //alias
      var model = resultModel;
      var a = aliases(item.fields);
      var update = {};
      update.$rename = a;

      if (a) {
        model.collection.update({}, update, {multi: true, upsert: false}, function(err) {
          if (err)
            console.log(err);
          next();
        });
      } else {
        next();
      }

    });
  }, function(err) {
    callback(null, null);
  });
}

function loadFact(fact, callback) {
  //var f = fields(fact.fields);
  var f = '*';
  var context = {
    table_name    : fact.name,
    database_name : fact.database,
    fields        : f,
    limit         : fact.limit,
  };

  get(context, function() {
    callback(null, null);
  });
}

function get(context, callback) {
  var query_options = {
    fields    : context.fields,
    table     : context.table_name,
    limit     : config.pull_threshold,
    offset    : 0,
    restrict  : context.limit
  };

  var name = context.database_name + '.' + context.table_name;

  var resultModel = localDb.tmp.model(name, new mongoose.Schema({any: {}}, {strict: false}), name);

  var onData = function(buff) {
    resultModel.collection.insert(buff, function(err, ret) {
      if (err)
        console.log(err);

      console.log('Inserted', name);
      callback(resultModel);
    });
  };

  resultModel.remove({}, function(err) {

    if (err)
      console.log(err);

    models.connection.findOne({'db_name': context.database_name}, function(err, conn_details) {
      dbs.get(conn_details, query_options, concat(onData));
    });

  });
}

module.exports = Converter;
