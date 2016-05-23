var conflib = require('configuration-lib');
var ulib    = require('url');
var authmn  = require('sinopia-auth-group-lib');
var cookie  = require('cookie');


module.exports = manager;


function manager(reload) {
  var count = 1;
  var rootconf = conflib.load();
  var groups = rootconf.source_server.sinopia.auth["auth-group-lib"].groups;

  var auth = require('../node_modules/sinopia/lib/auth.js')
                    (rootconf.source_server.sinopia);

  var auth_mid = auth.cookie_middleware();                    
  var admin = rootconf.source_server.sinopia.admin_grp;


  var rmap = {
    list   : list,
    add    : add,
    del    : del,
    reload : reload_mid,
    log    : log_mid,
  };


  function request(req, resp, next) {
    var urlinfo = ulib.parse(req.url, true);
    var urlsp = urlinfo.pathname.split('/');
    var handle = rmap[ urlsp[3] ];

    req.cookies = create_cookie(req, resp);
    resp.redirect = redirect;

    check_auth(req, resp, do_fn);

    function do_fn() {
      req.query = urlinfo.query;
      resp.setHeader("Content-Type", "text/html");
      if (!handle) handle = list;
      handle(req, resp, next);
    }
  }


  function check_auth(req, resp, next) {
    auth_mid(req, resp, function() {
      var gp = req.remote_user.real_groups;

      for (var i=0, e=gp.length; i<e; ++i) {
        if (gp[i] === admin) {
          next();
          return;
        }
      }

      var msg = 'bad username/password, access denied';
      resp.statusCode = 403;
      resp.statusMessage = msg;
      resp.end(msg);
    });
  }


  function list(req, resp, next) {
    var h = html(resp);
    h.toolbar();

    for (var g in groups) {
      h('<form action="/-/mana/add"><ul>');

      h.tag('h3', g);
      h.tag('input', '', {name: 'g', value: g, type: 'hidden'});
      h.tag('input', '', {name: 'u', value: '', type: 'text'});
      h.tag('input', '', {value: 'Add user', type: 'submit'});
      
      groups[g].forEach(function(u, i) {
        h('<li>')(u)(' &nbsp');
        h.tag('a', '[ Del ]', { href: '/-/mana/del?u=' + u + '&g=' + g });
        h('</li>');
      });
      h('</ul></form>');
    }

    h.end();
  }


  function add(req, resp, next) {
    var grp = groups[ req.query.g ];
    var u = req.query.u;
  
    if (grp && u) {
      var find;
      
      grp.forEach(function(user) {
        if (user === u) {
          return find = true;
        }
      });
      if (!find) {
        grp.push(u);
      }
    }
    conflib.saveNomerger(rootconf);
    resp.redirect('/-/mana/list');
  }


  function del(req, resp, next) {
    var grp = groups[ req.query.g ];
    var u = req.query.u;

    if (grp && u) {
      grp.forEach(function(user, i) {
        if (user === u) {
          grp.splice(i, 1);
          return find = true;
        }
      });
    }
    conflib.saveNomerger(rootconf);
    resp.redirect('/-/mana/list');
  }


  function reload_mid(req, resp, next) {
    reload();
    setTimeout(function() {
      resp.redirect('/-/mana/list');
    }, 500);
  }


  function log_mid(req, resp, next) {
    var h = html(resp);
    h.toolbar();
    h.tag('iframe', '', { src: '/-/log', width: '100%', 
          height: '90%', style: 'border:0' });
    h.end();
  }


  function redirect(where) {
    this.statusCode = 302;
    this.setHeader('Location', where);
    this.end();
  }


  function html(resp) {
    var _ = function(t) { resp.write(t); return _; };

    _('<html><head>');
    _('<link rel="stylesheet" type="text/css" href="/-/static/main.css">');
    _('</head><body>');

    _.end = function() {
      _('</body></html>');
      resp.end();
    };

    _.tag = function(tagname, cont, attr) {
      _('<')(tagname);
      attr && _.attr(attr);
      _('>')(cont)('</')(tagname)('>');
    };

    _.attr = function(obj) {
      for (var n in obj) {
        _(' ')(n)('="')( String(obj[n]) )('"');
      }
    };

    _.toolbar = function() {
      _('<div class="packages-header container">');

      _.tag('a', '[ < ]', 
            { href: '/', class: 'author pull-right' });      

      _.tag('a', '[- Apply Change & Restart service -]', 
            { href: '/-/mana/reload', class: 'author pull-right' });

      _.tag('a', '[- Show Log -]', 
            { href: '/-/mana/log', class: 'author pull-right' });

      _.tag('a', '[- Show Group -]', 
            { href: '/-/mana/list', class: 'author pull-right' });

      _('</div>');
    };

    return _;
  }


  return request;
}


function create_cookie(req, resp) {
  var ret = {};
  var cookies = cookie.parse(req.headers.cookie || '');

  ret.get = function(k) {
    // console.log('k', k , cookies[k])
    return cookies[k];
  };

  return ret;
}