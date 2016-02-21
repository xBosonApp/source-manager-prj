var config  = require('configuration-lib').load();


module.exports = npm_server;


function npm_server(port) {
  // var i = 2; //process.argv.length;
  var localc = config.source_server.local;
  if (!localc.port) {
    localc.port = port;
  }
  
  var ns = require('./local-server');
  ns.startup(localc);
}