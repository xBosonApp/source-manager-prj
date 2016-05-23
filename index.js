var path   = require('path');
var clib   = require('configuration-lib');
var Crypto = require('crypto');
var logger = require('logger-lib')('src');


process.on('SIGBREAK', onExit);
process.on('exit', onExit);
process.on('uncaughtException', onExit);
clib.wait_init(start_server);


function onExit(err) {
  if (err) {
    logger.error(err);
  }
  logger.log('exit.');
  process.exit(0);
}


function start_server() {
  var config = clib.load();
  var npm_server = null; 
  var type = process.argv[2] || config.source_server.type;

  config.source_server.sinopia.secret = 
        Crypto.pseudoRandomBytes(32).toString('hex');

  clib.save(config);


  switch(type) {
    case 'sinopia':
      npm_server = require('./lib/for-sinopia.js');
    break;

    case 'local':
      npm_server = require('./lib/for-ns.js');
    break;

    default:
      throw new Error('unknow server type ' + type);
  }

  npm_server(config.source_server.port);
  logger.log('Npm server start...', type);
}