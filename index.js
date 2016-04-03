var pull = require('pull-stream')

module.exports = function (manifest, opts) {
  var mockAPI = {}

  function makeMethod (name, type) {
    if (type == 'async') {
      return function () {
        var args = [].slice.call(arguments)
        var cb = args.pop()
        opts && opts.onAsync && opts.onAsync(name, args)
        cb()
      }
    }

    if (type == 'source') {
      return function () {
        var args = [].slice.call(arguments)
        opts && opts.onSource && opts.onSource(name, args)
        return pull.empty()
      }
    }

    if (type == 'sink') {
      return function () {
        return pull.collect(function(err, data){
          opts && opts.onSink && opts.onSink(name, err || data)
        })
      }
    }

    var duplexSource = makeMethod(name, 'source')
    var duplexSink = makeMethod(name, 'sink')
    return function () {
      return {
        source: duplexSource,
        sink: duplexSink()
      }
    }
  }

  // generate mock api, by recursing through the manifest definition
  function recurse (api, manf, path) {
    Object.keys(manf).forEach(function (name) {
      var type = manf[name]
      var _path = path ? path.concat(name) : [name]
      api[name] = (type && typeof type == 'object')
        ? recurse({}, type, _path)
        : makeMethod(name, type)
    })
    return api
  }
  recurse(mockAPI, manifest)

  return mockAPI
}