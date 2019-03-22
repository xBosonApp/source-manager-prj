var myip    = require('my-local-ip')();
var fs      = require('fs');
var express = require('express');


module.exports = start_server;


function start_server(conf) {  
	var mixer   = require('mixer-lib');
	var logger  = require('logger-lib')('sinopia');
	
  var Path = require('path');
  // fix node 6.9 'dirname' throw error
  try {
    Path.dirname();
  } catch(e) {
    var dn = Path.dirname;
    
    Path.dirname = function(name) {
      if (name) return dn(name);
      return '.';
    };
  }

	var port = conf.source_server.sinopia.port;
  mixer.create_http_mix_server({ whenLoad: whenLoad, port: port });
  logger.log('Look sinopia at http://' + myip + ':' + port);


  function whenLoad(app_pool) {
    var sinopia = require('sinopia');
    var config = conf.source_server.sinopia;
    var sinopia_app = sinopia(config);
    var sinopia_route = app_pool.addApp(mixer.express(sinopia_app));
    sinopia_route.add('/');

    var manalib = require('./sinopia-mana.js');
    var manager_app = manalib(app_pool.reload);
    var mana_route = app_pool.addApp( mixer.native(manager_app) );
    mana_route.add('/-/mana');

    var log_app = express();
    log_app.use('/-/log', logger.mid.log());
    var log_route = app_pool.addApp( mixer.native(log_app) );
    log_route.add('/-/log');
  }
}
