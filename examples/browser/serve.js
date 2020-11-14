const budo = require('budo')
const brfs = require('brfs')

budo('./app.js', {
  live: true,             // setup live reload
  port: parseInt(process.env.PORT) || 9000,
  host: 'localhost',
  browserify: {
    transform: brfs
  }
}).on('connect', function (ev) {
  console.log('Server running on %s', ev.uri)
  console.log('LiveReload running on port %s', ev.livePort)
}).on('update', function (buffer) {
  console.log('bundle - %d bytes', buffer.length)
})
