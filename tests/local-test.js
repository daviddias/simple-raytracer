var Lab = require('lab')
var Code = require('code')
var lab = exports.lab = Lab.script()

var experiment = lab.experiment
var test = lab.test
var before = lab.before
var after = lab.after
var expect = Code.expect

var fs = require('fs')
var srt = require('./../src/index.js')
var Png = require('png').Png

experiment('local: ', function () {
  // Constants
  var N_UNITS = 10
  var SCENE_PATH = './example-scenes/pokeball.rt'

  var scene
  var tasks
  var results

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
    var rgb = new Buffer(scene.global.width * scene.global.height * 3)

    results.map(function (el) { // jscs:disable
      var i = 0
      for (var y = el.begin_y; y < el.end_y; y++) {
        for (var x = el.begin_x; x < el.end_x; x++) {
          var z = (x * scene.global.width + y) * 3
          rgb[z] = el.data[i++]
          rgb[z + 1] = el.data[i++]
          rgb[z + 2] = el.data[i++]
        }
      } // jscs:enable
    })
    var png = new Png(rgb, scene.global.width, scene.global.height, 'rgb')
    fs.writeFileSync('/tmp/out.png', png.encodeSync())

    // TODO: compare /tmp/out.png and ./expected/pokeball.png
    done()
  })
})
