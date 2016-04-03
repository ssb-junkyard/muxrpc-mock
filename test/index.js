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
  t.plan(1)
  var api = muxmock(MANIFEST, { onAsync: function () {
    t.ok(true)
  }})
  api.async(function (err) {
    if (err)
      throw err
    t.end()
  })
})

tape('source method', function (t) {
  t.plan(1)
  var api = muxmock(MANIFEST, { onSource: function () {
    t.ok(true)
  }})
  pull(
    api.source(),
    pull.onEnd(function (err) {
      if (err)
        throw err
      t.end()
    })
  )
})

tape('sink method', function (t) {
  t.plan(1)
  var api = muxmock(MANIFEST, { onSink: function () {
    t.ok(true)
    t.end()
  }})
  pull(
    pull.values([1,2,3]),
    api.sink()
  )
})

tape('duplex method', function (t) {
  t.plan(2)
  var api = muxmock(MANIFEST, { 
    onSource: function () {
      t.ok(true)
    },
    onSink: function () {
      t.ok(true)
    }
  })
  pull(
    pull.values([1,2,3]),
    api.duplex(),
    pull.onEnd(function (err) {
      if (err)
        throw err
      t.end()
    })
  )
})