const test = require('tape')
const fs = require('fs')
const PNG = require('pngjs').PNG
const srt = require('./../src')

// Constants
const N_UNITS = 10
const SCENE_PATH = './scenes/pokeball.rt'

let scene
let tasks
let results

// Note for the reader. These tests don't really test anything other than making sure that the func doesn't explore
// TODO for the future, improve tests

test('prepare scene by path', function (t) {
  scene = srt.prepareScene.byPath(SCENE_PATH)
  t.end()
})

test('prepare scene by file', function (t) {
  t.end()
})

test('compare two equal scenes', function (t) {
  // TODO
  t.end()
})

test('compare two different scenes', function (t) {
  // TODO
  t.end()
})

test('prepare tasks', function (t) {
  tasks = srt.prepareTasks({
    split: N_UNITS, /* Number of tasks the job is going to be divided into */
    width: scene.global.width,
    height: scene.global.height
  })
  t.end()
})

test('ray trace', function (t) {
  results = tasks.map(function (task) {
    return {
      begin_x: task.begin_x, // jscs:disable
      end_x: task.end_x,
      begin_y: task.begin_y,
      end_y: task.end_y,
      animation: task.animation,
      data: srt.runTask(scene, task).data // jscs:enable
    }
  })
  t.end()
})

test('produce output in png', function (t) {
  const rgb = Buffer.alloc(scene.global.width * scene.global.height * 3)

  results.map(function (el) { // jscs:disable
    let i = 0
    for (let y = el.begin_y; y < el.end_y; y++) {
      for (let x = el.begin_x; x < el.end_x; x++) {
        const z = (x * scene.global.width + y) * 3
        rgb[z] = el.data[i++]
        rgb[z + 1] = el.data[i++]
        rgb[z + 2] = el.data[i++]
      }
    } // jscs:enable
  })
  // TODO: Learn how to do this with pngjs vs. node-png
  // const png = new PNG(rgb, scene.global.width, scene.global.height, 'rgb')
  // fs.writeFileSync('/tmp/out.png', png.encodeSync())

  // TODO: compare /tmp/out.png and ./expected/pokeball.png
  t.end()
})