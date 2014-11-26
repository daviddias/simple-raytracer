var srt = require('./../../../../src/index.js');
var fs = require('fs');
var domready = require('domready');

window.app = {
  init: function() {
    console.log('RAYTRACING START');
    var N_UNITS = 50;
    var scene_file = fs.readFileSync('./../../example-scenes/pokeball.rt',
                                     'utf8');
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
    console.log('RAYTRACING FINISHED:\n');


    console.log('NOW TO FILL THAT CANVAS');

    domready(function () {
      // dom is loaded!
    
      /* Add a canvas element */ 
      var body = document.querySelector('body');
      body.innerHTML = '<h1>a</h1>';

      body.innerHTML = '<canvas id="mycanvas"></canvas>';

      var canvas = document.querySelector('#mycanvas');
      var canvasContext = canvas.getContext('2d');
      var canvasImageData = [];


      /* Clear canvas */
      canvas.width = canvas.width;

      var currFrame = 0;
      canvas.width = scene.global.width;
      canvas.height = scene.global.height;

      // we just have one frame
      canvasImageData[0] = canvasContext.createImageData(canvas.width,
                                                         canvas.height);

      results.map(function (el) {
        var y = el.data[1];
        var idxMsg = 2;
        for(var x = 0; x < canvas.width; x++) {
          var index = (y * canvas.width + x) * 4;
          canvasImageData[currFrame].data[index++] = el.data[idxMsg++];
          canvasImageData[currFrame].data[index++] = el.data[idxMsg++];
          canvasImageData[currFrame].data[index++] = el.data[idxMsg++];
          canvasImageData[currFrame].data[index++] = 255;
        }
        canvasContext.putImageData(canvasImageData[currFrame], 0, 0); 
      });

    });


  }
};

window.app.init();