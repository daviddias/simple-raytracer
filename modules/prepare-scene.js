var fs = require('fs');
var Parser = require('./scene-parser').Parser;

module.exports = function (scene_file_path) {
  // var scene_file = SCENE
  var input = fs.readFileSync(scene_file_path, 'utf8');
  var scene = new Parser(input).parse();
  return scene;
};