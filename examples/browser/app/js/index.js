var srt = require('./../../../../src/index.js')
var fs = require('fs')
var domready = require('domready')

window.app = {
  init: function () {
    /* parse the 'world' that is going to be ray traced */
    var scene_file = fs.readFileSync('./../../example-scenes/pokeball.rt',
      'utf8')
    var scene = srt.prepareScene.byFile(scene_file)

    /* number of units per split (total: N_UNITS * N_UNITS) */
    var N_UNITS = 50

    /* create each individual task to be executed */
    var tasks = srt.prepareTasks({
      split: N_UNITS,
      width: scene.global.width,
      height: scene.global.height
    })

    var startTime = Date.now()

    /* take each task and execute a ray trace on the world with it */
    var results = tasks.map(function (task) {
      var s = Date.now()

      var thing = {
        begin_x: task.begin_x,
        end_x: task.end_x,
        begin_y: task.begin_y,
        end_y: task.end_y,
        animation: task.animation,
        data: srt.runTask(scene, task).data
      }
      console.log(Date.now() - s)
      return thing
    })

    var endTime = Date.now()
    console.log('diff: ', endTime - startTime)

    /* we have to make sure the dom is ready before adding our canvas el */
    domready(function () {
      /* add a canvas element */
      var body = document.querySelector('body')
      body.innerHTML = '<canvas id="mycanvas"></canvas>'

      /* prepare our canvas */
      var canvas = document.querySelector('#mycanvas')
      var canvasContext = canvas.getContext('2d')
      var canvasImageData = []

      /* Clear canvas */
      canvas.width = canvas.width

      var currFrame = 0
      canvas.width = scene.global.width
      canvas.height = scene.global.height

      /* create the image for one frame */
      canvasImageData[0] = canvasContext.createImageData(canvas.width,
        canvas.height)

      /* get each result of the ray trace and inject on canvas obj */
      results.map(function (el) {
        var i = 0
        for (var y = el.begin_y; y < el.end_y; y++) {
          for (var x = el.begin_x; x < el.end_x; x++) {
            var index = (y * canvas.width + x) * 4
            canvasImageData[currFrame].data[index++] = el.data[i++]
            canvasImageData[currFrame].data[index++] = el.data[i++]
            canvasImageData[currFrame].data[index++] = el.data[i++]
            canvasImageData[currFrame].data[index++] = 255
          }
        }
      })

      /* reload canvas with new data */
      canvasContext.putImageData(canvasImageData[currFrame], 0, 0)

    })
  }
}

window.app.init()
