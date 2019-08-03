(function(){
  var path, os, fs, Config;
  path = require('path');
  os = require('os');
  fs = require('fs-extra');
  Config = (function(){
    Config.displayName = 'Config';
    var prototype = Config.prototype, constructor = Config;
    function Config(env, homedir){
      this.li = bind$(this, 'li', prototype);
      this.line = bind$(this, 'line', prototype);
      this.dir = process.env[env] || path.join(os.homedir(), homedir);
    }
    Config.prototype.line = async function(name, init){
      var fpath, li, i$, ref$, len$, i;
      fpath = path.join(this.dir, name) + '.line.txt';
      if (!(await fs.exists(fpath))) {
        if (init) {
          (await fs.outputFile(fpath, init));
        }
        return init;
      }
      li = (await fs.readFile(fpath, 'utf8'));
      for (i$ = 0, len$ = (ref$ = li.split("\n")).length; i$ < len$; ++i$) {
        i = ref$[i$];
        i = i.trim();
        if (i) {
          if (i.charAt(0) !== "#") {
            return i;
          }
        }
      }
      return init;
    };
    Config.prototype.li = async function(name, init){
      var fpath, li, r, i$, ref$, len$, i;
      fpath = path.join(this.dir, name) + '.li.txt';
      if (!(await fs.exists(fpath))) {
        if (init.length) {
          (await fs.outputFile(fpath, init.join('\n')));
        }
        return init;
      }
      li = (await fs.readFile(fpath, 'utf8'));
      r = [];
      for (i$ = 0, len$ = (ref$ = li.split("\n")).length; i$ < len$; ++i$) {
        i = ref$[i$];
        i = i.trim();
        if (i) {
          if (i.charAt(0) !== "#") {
            r.push(i);
          }
        }
      }
      if (r.length) {
        return r;
      }
      return init;
    };
    return Config;
  }());
  module.exports = Config;
  function bind$(obj, key, target){
    return function(){ return (target || obj)[key].apply(obj, arguments) };
  }
}).call(this);
