var fs = require('fs');
var srt = require('./index.js');
var Png = require('png').Png;

// Constants
var N_UNITS = 50;
var SCENE_PATH = './example-scenes/pokeball.rt';

var scene = srt.prepareScene.byPath(SCENE_PATH);

var tasks = srt.prepareTasks({
  split: N_UNITS, /* Number of tasks the job is going to be divided into */
  width: scene.global.width,
  height: scene.global.height
});


var rgb = new Buffer(scene.global.width * scene.global.height * 3);

var results = tasks.map(function(task) {
  return {
    begin_x: task.begin_x,
    end_x: task.end_x,
    begin_y: task.begin_y,
    end_y: task.end_y,
    animation: task.animation,
    data: srt.runTask(scene, task).data
  };
});

// console.log('\n\nTASKS: \n\n', tasks);
// console.log('\n\nSCENE: \n\n', scene);
// console.log('\n\nRAYTRACED \n\n', results);


results.map(function (el) {
  var i = 0;
  for(var y = el.begin_y; y < el.end_y; y++) {
    for(var x = el.begin_x; x < el.end_x; x++) {
      var z = (x * scene.global.width + y) * 3;
      rgb[z] = el.data[i++];
      rgb[z+1] = el.data[i++];
      rgb[z+2] = el.data[i++];
    }
  }
});

// console.log('RGB:\n', rgb);


var png = new Png(rgb, scene.global.width, scene.global.height, 'rgb');

fs.writeFileSync('./out.png', png.encodeSync());

// fs.writeFileSync('./out.png', png.encodeSync().toString('binary'), 'binary');

