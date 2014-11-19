var fs = require('fs');
var Parser = require('./scene-parser').Parser;

exports = module.exports; 

exports.byPath = function (scene_file_path) {
  var input = fs.readFileSync(scene_file_path, 'utf8');
  var scene = new Parser(input).parse();
  return scene;
};

exports.byFile = function (scene_file) {
  var scene = new Parser(scene_file).parse();
  return scene;
};