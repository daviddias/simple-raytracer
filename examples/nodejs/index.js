const fs = require('fs')
const srt = require('./../../src/index.js')

/* use the Png module to export the generated image to Png */
const PNG = require('pngjs').PNG

/* parse the 'world' that is going to be ray traced */
const SCENE_PATH = './../../scenes/pokeball.rt'
const scene = srt.prepareScene.byPath(SCENE_PATH)

/* number of units per split (total: N_UNITS * N_UNITS) */
const N_UNITS = 50

/* create each individual task to be executed */
const tasks = srt.prepareTasks({
  split: N_UNITS,
  width: scene.global.width,
  height: scene.global.height
})

/* buffer that will glue the image all together before being exported */
const rgb = Buffer.alloc(scene.global.width * scene.global.height * 3)

/* take each task and execute a ray trace on the world with it */
const results = tasks.map(function (task) {
  return {
    begin_x: task.begin_x,
    end_x: task.end_x,
    begin_y: task.begin_y,
    end_y: task.end_y,
    animation: task.animation,
    data: srt.runTask(scene, task).data
  }
})

/* glue each ray trace result back together */
results.map(function (el) {
  let i = 0
  for (let y = el.begin_y; y < el.end_y; y++) {
    for (let x = el.begin_x; x < el.end_x; x++) {
      const z = (x * scene.global.width + y) * 3
      rgb[z] = el.data[i++]
      rgb[z + 1] = el.data[i++]
      rgb[z + 2] = el.data[i++]
    }
  }
})

/* write the image to a png */
const png = new PNG(rgb)
const buf = PNG.sync.write(png, {
  width: scene.global.width,
  height: scene.global.height
})

fs.writeFileSync('/tmp/out.png', buf)
