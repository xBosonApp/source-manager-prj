module.exports = npm_server;


function npm_server(config) {
	var logger  = require('logger-lib')('local');
	
  // var i = 2; //process.argv.length;
  var localc = config.source_server.local;
  if (!localc.port) {
    throw new Error("not config npm server port");
  }
  
  var ns = require('./local-server');
  ns.startup(localc);
	
	var myip = require('my-local-ip')();
	logger.log('Look local at http://' + myip + ':' + localc.port);
}