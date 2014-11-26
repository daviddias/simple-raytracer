var srt = require('./../../../../src/index.js');
var fs = require('fs');

window.app = {
  init: function () {
    var body = document.querySelector('body');
    body.innerHTML = '<canvas id="mycanvas"></canvas>'

    var canvas = document.querySelector('#mycanvas');
    var canvasContext = canvas.getContext("2d");
    var canvasImageData = [];

    canvas.width = canvas.width;  /* Clear canvas */

    var currFrame = 0;

    var drawFrame = 0;
    var then = Date.now();
    var delta;



    


    console.log('RAYTRACING START');
    var N_UNITS = 50;
    var scene_file = fs.readFileSync('./../../example-scenes/pokeball.rt', 'utf8');
    var scene = srt.prepareScene.byFile(scene_file);
    console.log('SCENE READY');

    var tasks = srt.prepareTasks({
      split: N_UNITS, 
      width: scene.global.width,
      height: scene.global.height
    });
    console.log('TASKS READY');

    var results = tasks.map(function(task) {
      console.log('TASK DONE');
      return {
        begin_x: task.begin_x,
        end_x: task.end_x,
        begin_y: task.begin_y,
        end_y: task.end_y,
        animation: task.animation,
        data: srt.runTask(scene, task).data
      };
    });      
    console.log('RAYTRACING FINISHED:\n', results);
  }
};

window.app.init();