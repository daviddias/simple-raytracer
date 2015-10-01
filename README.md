simple-raytracer
================

> `simple-raytracer` works as a standalone version of the JS raytracer found in [distracer.io](http://distracer.io), which was inspired by [jsRayTracer](https://github.com/vjeux/jsRayTracer). It's purpose is to offer a simple raytracing interface that can be run locally in, in a distributed fashion on a server or even in browsers

## Project Information

> [David Dias MSc in Peer-to-Peer Networks by Technical University of Lisbon](https://github.com/diasdavid/browserCloudjs#research-and-development)

[![](https://img.shields.io/badge/INESC-GSD-brightgreen.svg?style=flat-square)](http://www.gsd.inesc-id.pt/) [![](https://img.shields.io/badge/TÉCNICO-LISBOA-blue.svg?style=flat-square)](http://tecnico.ulisboa.pt/) [![](https://img.shields.io/badge/project-browserCloudjs-blue.svg?style=flat-square)](https://github.com/diasdavid/browserCloudjs)

This work was developed by David Dias with supervision by Luís Veiga, all in INESC-ID Lisboa (Distributed Systems Group), Instituto Superior Técnico, Universidade de Lisboa, with the support of Fundação para a Ciência e Tecnologia. 

More info on the team's work at: 
- http://daviddias.me
- http://www.gsd.inesc-id.pt/~lveiga

If you use this project, please acknowledge it in your work by referencing the following document:

David Dias and Luís Veiga. browserCloud.js A federated community cloud served by a P2P overlay network on top of the web platform. INESC-ID Tec. Rep. 14/2015, Apr. 2015

## Badgers

[![NPM](https://nodei.co/npm/simple-raytracer.png?downloads=true&stars=true)](https://nodei.co/npm/simple-raytracer/)

[![Gitter](https://badges.gitter.im/Join Chat.svg)](https://gitter.im/diasdavid/simple-raytracer?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)[![Dependency Status](https://david-dm.org/diasdavid/simple-raytracer.svg)](https://david-dm.org/diasdavid/simple-raytracer)

[![](https://cldup.com/pgZbzoshyV-3000x3000.png)](http://www.gsd.inesc-id.pt/)

## What is Ray Tracing?

tl;dr; In computer graphics, ray tracing is a technique for generating an image by tracing the path of light through pixels in an image plane and simulating the effects of its encounters with virtual objects.

If you would like to know more, [wikipedia has your back](http://en.wikipedia.org/wiki/Ray_tracing_(graphics))

## What does this module offer

A simple interface to execute a ray tracing job over a 'world' or 'scene' described in CSS, from scene parser, to job task partition, to the actual individual ray trace task and finally how to glue the results together so you can get your rendered image. 

A great place to start is by checking the examples folder to see how to run it using Node.js or using the browser only.

## API

```
/* require the module */ 
var srt = require('simple-raytracer');

/* parse a scene */
var scene = srt.prepareScene.byPath(path/to/scene/file);

/* create individual tasks, each one is a work unit */
var tasks = srt.prepareTasks({
  split: 20,  
  width: scene.global.width,
  height: scene.global.height
});

/* use srt.runTask to execute each of them */
var rayTraceResult = srt.runTask(scene, tasks[0]);
```

## Example of running it with Node

You can find the [example here](https://github.com/diasdavid/simple-raytracer/tree/master/examples/browser), it is using [`Png`](https://www.npmjs.org/package/png) to export the image to a .png. To use the `png` module properly, you have to have `libpng` installed, if you are on a mac you can use `brew install libpng` or if you are on ubuntu, you can do `sudo apt-get install libpng12-0`.

To run it simply do:

```
$ git clone git@github.com:diasdavid/simple-raytracer.git
$ cd simple-raytracer
$ npm i
$ cd examples/node
$ node index.js
```

## Example of running it in the browser with `browserify`

You can find the [example here](https://github.com/diasdavid/simple-raytracer/tree/master/examples/node), it is using [`moonboots_hapi`](https://www.npmjs.org/moonboots_hapi) to do the browserify and serve the file work.

To run it simply do:

```
$ git clone git@github.com:diasdavid/simple-raytracer.git
$ cd simple-raytracer
$ npm i
$ cd examples/browser
$ node index.js
# open your browser in http://localhost:9000
```

## Acknowledgements

Thank you to Diogo Cunha and Pierre Ozoux for creating distracer.io that lead to the creation of this module and Igor Soarez for reviewing and helping me solve a gnarly bug :)
