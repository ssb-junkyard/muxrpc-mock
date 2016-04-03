var muxmock  = require('../')
var tape = require('tape')
var pull = require('pull-stream')

var MANIFEST = {
  async: 'async',
  source: 'source',
  sink: 'sink',
  duplex: 'duplex'
}

tape('async method', function (t) {
  t.plan(2)
  var api = muxmock(MANIFEST, { onAsync: function (name, args) {
    console.log(name, args)
    t.equal(name, 'async')
    t.equal(args[0], 'hello')
  }})
  api.async('hello', function (err) {
    if (err)
      throw err
    t.end()
  })
})

tape('source method', function (t) {
  t.plan(2)
  var api = muxmock(MANIFEST, { onSource: function (name, args) {
    t.equal(name, 'source')
    t.equal(args[0], 'hello')
  }})
  pull(
    api.source('hello'),
    pull.onEnd(function (err) {
      if (err)
        throw err
      t.end()
    })
  )
})

tape('sink method', function (t) {
  t.plan(2)
  var api = muxmock(MANIFEST, { onSink: function (name, data) {
    t.equal(name, 'sink')
    t.equal(data[0], 'hello')
    t.end()
  }})
  pull(
    pull.values(['hello']),
    api.sink()
  )
})

tape('duplex method', function (t) {
  t.plan(3)
  var api = muxmock(MANIFEST, { 
    onSource: function (name) {
      t.equal(name, 'duplex')
    },
    onSink: function (name, data) {
      t.equal(name, 'duplex')
      t.equal(data[0], 'hello')
    }
  })
  pull(
    pull.values(['hello']),
    api.duplex(),
    pull.onEnd(function (err) {
      if (err)
        throw err
      t.end()
    })
  )
})