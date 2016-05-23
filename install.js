var clib = require('configuration-lib');


clib.wait_init(function() {
  var config = clib.load();
  clib.mkdir(config.logger.log_dir);
  clib.mkdir(config.source_server.sinopia.storage);
});