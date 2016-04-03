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
  onAsync: function () {
    // async method called
  },
  onSource: function () {
    // source or duplex method called
  },
  onSink: function () {
    // sink or duplex method called
  }
})
```