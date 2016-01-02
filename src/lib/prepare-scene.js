var fs = require('fs')
var Parser = require('./scene-parser').Parser

exports = module.exports

exports.byPath = function (sceneFilePath) {
  var input = fs.readFileSync(sceneFilePath, 'utf8')
  var scene = new Parser(input).parse()
  return scene
}

exports.byFile = function (sceneFile) {
  var scene = new Parser(sceneFile).parse()
  return scene
}
