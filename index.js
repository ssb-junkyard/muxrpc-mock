var pull = require('pull-stream')

module.exports = function (manifest, opts) {
  var mockAPI = {}

  function asyncMethod (cb) {
    opts && opts.onAsync && opts.onAsync()
    cb()
  }

  function sourceMethod () {
    opts && opts.onSource && opts.onSource()
    return pull.empty()
  }

  function sinkMethod () {
    return pull.onEnd(function(){
      opts && opts.onSink && opts.onSink()
    })
  }

  function duplexMethod () {
    return {
      source: sourceMethod(),
      sink: sinkMethod()
    }
  }

  var METHODS = {
    async: asyncMethod,
    source: sourceMethod,
    sink: sinkMethod,
    duplex: duplexMethod
  }

  // generate mock api, by recursing through the manifest definition
  function recurse (api, manf, path) {
    Object.keys(manf).forEach(function (name) {
      var type = manf[name]
      var _path = path ? path.concat(name) : [name]
      api[name] = (type && typeof type == 'object')
        ? recurse({}, type, _path)
        : METHODS[type]
    })
    return api
  }
  recurse(mockAPI, manifest)

  return mockAPI
}