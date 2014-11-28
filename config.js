var config = module.exports;

var PRODUCTION = process.env.NODE_ENV === 'production';

config.express = {
  port: process.env.EXPRESS_PORT || 3000,
  ip: '127.0.0.1'
};

config.mongodb = {
  host: 'localhost',
  port: 27017,
  dbs: {
    local: 'ods-local',
    tmp: 'ods-tmp',
    //result: 'ods-result'
  }
};

config.supported_dbs = [
  'mysql',
  //'mssql',
];
