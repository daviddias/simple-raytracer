simple-raytracer
================

[![NPM](https://nodei.co/npm/simple-raytracer.png?downloads=true&stars=true)](https://nodei.co/npm/simple-raytracer/)
[![Dependency Status](https://david-dm.org/daviddias/simple-raytracer.svg)](https://david-dm.org/daviddias/simple-raytracer)

> `simple-raytracer` works as a standalone version of the JS raytracer found in [distracer.io](http://distracer.io), which was inspired by [jsRayTracer](https://github.com/vjeux/jsRayTracer). It's presents a very simple interface to break a Ray Tracing job into multiple tasks that can be run sequentially or in parallel.

## What is Ray Tracing?

tl;dr; In computer graphics, ray tracing is a technique for generating an image by tracing the path of light through pixels in an image plane and simulating the effects of its encounters with virtual objects.

The original authors of jsRayTracer offer a great in depth explanation of how Ray Tracing works and how the core of this module performs it. Worth [checking it out](https://blog.vjeux.com/2012/javascript/javascript-ray-tracer.html).

If you would like to know more, [wikipedia has your back](http://en.wikipedia.org/wiki/Ray_tracing_(graphics))

## What does this module offer

A simple interface to execute a ray tracing job over a 'world' or 'scene' described in CSS, from scene parser, to job task partition, to the actual individual ray trace task and finally how to glue the results together so you can get your rendered image.

A great place to start is by checking the examples folder to see how to run it using Node.js or using the browser only.

## API

```
/* require the module */
const srt = require('simple-raytracer');

/* load a scene */
const scene = srt.prepareScene.byPath(<path/to/scene/file>);

/* create individual tasks, each one is a work unit */
const tasks = srt.prepareTasks({
  split: 20,
  width: scene.global.width,
  height: scene.global.height
});

/* use srt.runTask to execute each of them */
const rayTraceResult = srt.runTask(scene, tasks[0]);
```

## Example of running it with Node

You can find the [example here](https://github.com/daviddias/simple-raytracer/tree/master/examples/browser), it is using [`pngjs`](https://www.npmjs.org/package/pngjs) to export the image to a .png to export the render to png. To run it simply do:

```
git clone git@github.com:diasdavid/simple-raytracer.git
cd simple-raytracer
npm i
cd examples/node
node index.js
```

## Example of running it in the browser with `browserify`

You can find the [example here](https://github.com/diasdavid/simple-raytracer/tree/master/examples/node). To run it simply do:

```
git clone git@github.com:daviddias/simple-raytracer.git
cd simple-raytracer
npm i
cd examples/browser
node serve.js
open your browser in http://localhost:9000
```

## Acknowledgements

[![](https://img.shields.io/badge/INESC-GSD-brightgreen.svg?style=flat-square)](http://www.gsd.inesc-id.pt/)
[![](https://img.shields.io/badge/TÉCNICO-LISBOA-blue.svg?style=flat-square)](http://tecnico.ulisboa.pt/)
[![](https://img.shields.io/badge/project-browserCloudjs-blue.svg?style=flat-square)](https://github.com/daviddias/browserCloudjs)

This module was initialy developed as part of David Dias' M.Sc Thesis project, [browserCloudjs](https://github.com/daviddias/thesis.browserCloud.js/blob/master/document.pdf), under supervision by Luís Veiga, Distributed Systems Group @ INESC-ID Lisboa , Instituto Superior Técnico, Universidade de Lisboa, with the support of Fundação para a Ciência e Tecnologia.

More info on the team's work at:
- http://daviddias.me
- http://www.gsd.inesc-id.pt/~lveiga

Additionall thanks to Diogo Cunha and Pierre Ozoux for creating distracer.io and Igor Soarez for reviewing and helping me solve a gnarly bug :)
