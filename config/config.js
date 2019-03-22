var path = require('path');
var clib = require('configuration-lib');


var config_dir_base = clib.nodeconf + '/node-source-server';


var _config = {
  
  ext_config_file : config_dir_base + '/config.json',

  logger : {
    log_dir : config_dir_base + '/logs'
  },

  source_server : {

    // 启动参数的优先级高于配置的优先级
    // `sinopia` | `local` | `both`
    type : 'sinopia',

    local : {
      // 必须是正确的网络出口 IP
      host        : 'localhost', // 192.168.7.144
      // 如果为 0 则使用全局配置
      port        : 6071,
      dir         :  path.normalize(__dirname + '/../../'),
      expire      : 60,
      // 当找不到模块时, 路由到另一个 npm server
      parent_host : 'localhost',
      parent_port : 6070
    },

    sinopia : {
      storage    : config_dir_base + '/storage-packages/',
      users_file : config_dir_base + '/users.json',
      max_users  : 20,
      secret     : 'secret auto generate',
      // 超级用户组, 在组中的用户可以进入管理画面
      admin_grp  : 'adminusr',
      max_body_size : '100mb',
			port 			 : 6070,

      logs: [{
        type  : 'file', 
        path  : path.normalize(config_dir_base + '/logs/sinopia.log'),
        level : 'info',
        format: 'pretty',
      }, {
        type  : 'stdout', 
        level : 'http',
        format: 'pretty', 
      }],

      auth : {
        "auth-group-lib": {
          "file": config_dir_base + "/users.json",
          "groups": {
            "adminusr" : [ 'yanming' ],
            "devuser"  : [ 'yanming' ],
            "libuser"  : [ 'yanming' ]
          }
        }
      },

      web : {
        title : 'ZR private npm server.',
        logo  : __dirname + '/logo.png'
      },

      uplinks : {
        npmjs : {
          url: 'https://registry.npmjs.org/'
        },
        taobao: {
          url: "http://registry.npm.taobao.org/"
        },
        zr : {
          url: 'http://localhost:6070/'
        }
      },

      packages: {
        "about-zy-npm": {
          "allow_access": "$all",
          "allow_publish": "yanming adminusr"
        },
        "*-lib": {
          "allow_access": "devuser libuser adminusr",
          "allow_publish": "devuser adminusr"
        },
        "*.lib": {
          "allow_access": "devuser libuser adminusr",
          "allow_publish": "devuser adminusr"
        },
        "*-prj": {
          "allow_access": "devuser adminusr",
          "allow_publish": "adminusr"
        },
        "*.prj": {
          "allow_access": "devuser adminusr",
          "allow_publish": "adminusr"
        },
        "*-mix": {
          "allow_access": "devuser adminusr",
          "allow_publish": "adminusr"
        },
        "*.mix": {
          "allow_access": "devuser adminusr",
          "allow_publish": "adminusr"
        },
        "*": {
          "allow_access": "$authenticated",
          "allow_publish": "devuser",
          "proxy": "npmjs"
        }
      }
    },
  }

};

module.exports = _config;