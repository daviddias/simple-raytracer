var hapi = require('hapi');
var moonboots = require('moonboots_hapi');

var port = parseInt(process.env.PORT) || 9000;
var server = hapi.createServer(port, 'localhost');

server.pack.register({
  plugin: moonboots,
  options: {
    appPath: '/{p*}',
    moonboots: {
      main: __dirname + '/app/js/index.js',
      developmentMode: true,
      browserify: {
        transforms: ['brfs']
      }
    }
  }
}, function () {
  server.start(function () {
    console.log('server has started on: http://localhost:' + port);
  });
});