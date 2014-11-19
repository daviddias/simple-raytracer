simple-raytracer
================

> `simple-raytracer` works as a standalone version of the JS raytracer found in [distracer.io](http://distracer.io), which was inspired by [jsRayTracer](https://github.com/vjeux/jsRayTracer). It's purpose is to offer a simple raytracing interface that can be run locally in, in a distributed fashion on a server or even in browsers

## Badgers

[![NPM](https://nodei.co/npm/simple-raytracer.png?downloads=true&stars=true)](https://nodei.co/npm/simple-raytracer/)

[![Gitter](https://badges.gitter.im/Join Chat.svg)](https://gitter.im/diasdavid/simple-raytracer?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge) 

[![Dependency Status](https://david-dm.org/diasdavid/simple-raytracer.svg)](https://david-dm.org/diasdavid/simple-raytracer)

[![Build Status](https://travis-ci.org/diasdavid/simple-raytracer.svg)](https://travis-ci.org/diasdavid/simple-raytracer)

## Description



## API



## Example local

```
var fs = require('fs');
var srt = require('simple-raytracer');
var Png = require('png').Png;

var N_SPLIT = 50; // The number of tasks will be N_SPLIT * N_SPLIT
var SCENE_PATH = './example-scenes/pokeball.rt'; // The scene configuration to be processed

// Parse and load the scene configuration
var scene = srt.prepareScene(SCENE_PATH);

// Create the tasks that are going to be executed, depending on the scene size and N_SPLIT
var tasks = srt.prepareTasks({
  split: N_SPLIT, /* Number of tasks the job is going to be divided into */
  width: scene.global.width,
  height: scene.global.height
});


// Execute a RayTrace for every single Task
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

// Construct the image into a buffer 
var rgb = new Buffer(scene.global.width * scene.global.height * 3);

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

// Print out an PNG from the RayTraced Image
var png = new Png(rgb, scene.global.width, scene.global.height, 'rgb');
fs.writeFileSync('./out.png', png.encodeSync());
```


## Example browser with `browserify`


## Acknowledgements

Thank you to Diogo Cunha and Pierre Ozoux for creating distracer.io that lead to the creation of this module and Igor Soarez for reviewing and helping me solve a gnarly bug :)
  