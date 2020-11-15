const Lab = require('lab')
const Code = require('code')
const lab = exports.lab = Lab.script()

const experiment = lab.experiment
const test = lab.test
const before = lab.before
const after = lab.after
const expect = Code.expect

const fs = require('fs')
const srt = require('./../src/index.js')
const PNG = require('pngjs').PNG

experiment('local: ', function () {
  // Constants
  const N_UNITS = 10
  const SCENE_PATH = './example-scenes/pokeball.rt'

  let scene
  let tasks
  let results

  before(function (done) {
    done()
  })

  after(function (done) {
    done()
  })

  test('prepare scene by path', function (done) {
    scene = srt.prepareScene.byPath(SCENE_PATH)
    done()
  })

  test('prepare scene by file', function (done) {
    done()
  })

  test('compare two equal scenes', function (done) {
    // TODO
    done()
  })

  test('compare two different scenes', function (done) {
    // TODO
    done()
  })

  test('prepare tasks', function (done) {
    tasks = srt.prepareTasks({
      split: N_UNITS, /* Number of tasks the job is going to be divided into */
      width: scene.global.width,
      height: scene.global.height
    })
    done()
  })

  test('ray trace', function (done) {
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
    done()
  })

  test('produce output in png', function (done) {
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
    const png = new PNG(rgb, scene.global.width, scene.global.height, 'rgb')
    fs.writeFileSync('/tmp/out.png', png.encodeSync())

    // TODO: compare /tmp/out.png and ./expected/pokeball.png
    done()
  })
})
