(function(){
  var path, os, fs, File, Config;
  path = require('path');
  os = require('os');
  fs = require('fs-extra');
  File = (function(){
    File.displayName = 'File';
    var prototype = File.prototype, constructor = File;
    function File(path){
      this.path = path;
    }
    File.prototype.set = function(data){
      return fs.outputFile(this.path, data);
    };
    File.prototype.get = function(encoding){
      if (fs.exists(this.path)) {
        return fs.readFile(this.path, encoding);
      }
    };
    File.prototype.utf8 = function(){
      return this.get('utf8');
    };
    return File;
  }());
  Config = (function(){
    Config.displayName = 'Config';
    var prototype = Config.prototype, constructor = Config;
    function Config(env, homedir){
      this.li = bind$(this, 'li', prototype);
      this.line = bind$(this, 'line', prototype);
      this.dir = process.env[env] || path.join(os.homedir(), homedir);
    }
    Config.prototype.file = function(name){
      return new File(path.join(this.dir, name));
    };
    Config.prototype.line = async function(name, init, write){
      var fpath, li, i$, ref$, len$, i;
      write == null && (write = false);
      fpath = path.join(this.dir, name) + '.line.txt';
      if (write) {
        (await fs.outputFile(fpath, init));
        return init;
      }
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
    Config.prototype.li = async function(name, init, write){
      var fpath, li, r, i$, ref$, len$, i;
      write == null && (write = false);
      fpath = path.join(this.dir, name) + '.li.txt';
      if (write) {
        (await fs.outputFile(fpath, init.join('\n')));
        return init;
      }
      if (!(await fs.exists(fpath))) {
        if (init && init.length) {
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
