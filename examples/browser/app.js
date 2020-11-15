const srt = require('../../src/index.js')
const fs = require('fs')
const domready = require('domready')

window.app = {
  init: function () {
    /* parse the 'world' that is going to be ray traced */
    const buf = fs.readFileSync('./../../scenes/pokeball.rt', 'utf8')
    const scene = srt.prepareScene.byBuffer(buf)

    /* number of units per split (total: N_UNITS * N_UNITS) */
    const N_UNITS = 50

    /* create each individual task to be executed */
    const tasks = srt.prepareTasks({
      split: N_UNITS,
      width: scene.global.width,
      height: scene.global.height
    })

    const startTime = Date.now()

    /* take each task and execute a ray trace on the world with it */
    const results = tasks.map(function (task) {
      const thing = {
        begin_x: task.begin_x,
        end_x: task.end_x,
        begin_y: task.begin_y,
        end_y: task.end_y,
        animation: task.animation,
        data: srt.runTask(scene, task).data
      }

      return thing
    })

    const endTime = Date.now()
    console.log('Took: %d seconds', endTime - startTime)

    /* we have to make sure the dom is ready before adding our canvas el */
    domready(function () {
      /* add a canvas element */
      const body = document.querySelector('body')
      body.innerHTML = '<canvas id="mycanvas"></canvas>'

      /* prepare our canvas */
      const canvas = document.querySelector('#mycanvas')
      const canvasContext = canvas.getContext('2d')
      const canvasImageData = []

      /* Clear canvas */
      canvas.width = canvas.width

      const currFrame = 0
      canvas.width = scene.global.width
      canvas.height = scene.global.height

      /* create the image for one frame */
      canvasImageData[0] = canvasContext.createImageData(canvas.width, canvas.height)

      /* get each result of the ray trace and inject on canvas obj */
      results.map(function (el) {
        let i = 0
        for (let y = el.begin_y; y < el.end_y; y++) {
          for (let x = el.begin_x; x < el.end_x; x++) {
            let index = (y * canvas.width + x) * 4
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
