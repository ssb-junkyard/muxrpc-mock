# MuxRPC Mock

Generate mock APIs from muxrpc manifests.
Useful for generating test suites.

```js
var muxmock = require('muxrpc-mock')

// typical muxrpc manifest:
var manifest = {
  async: 'async',
  source: 'source',
  sink: 'sink',
  duplex: 'duplex'
}

var api = muxmock(manifest)
// api now has all methods defined, but each do nothing
```

You can specify functions to be called when the api methods are hit:

```js
var api = muxmock(manifest, {
  onAsync: function (method, arguments) {
    // async method called
    // `method` is the name of the function called
    // `arguments` is the parameters of the call
  },
  onSource: function (method, arguments) {
    // source or duplex method called
    // `method` is the name of the function called
    // `arguments` is the parameters of the call
  },
  onSink: function (method, data) {
    // sink or duplex method called
    // `method` is the name of the function called
    // `data` is the collected data from the pull stream
  }
})
```