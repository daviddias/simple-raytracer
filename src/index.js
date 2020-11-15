const fs = require('fs')
const Parser = require('./scene-parser')

const api = {}

api.prepareScene = {}

api.prepareScene.byPath = (scenePath) => {
  const buffer = fs.readFileSync(scenePath, 'utf8')
  return api.prepareScene.byBuffer(buffer)
}

api.prepareScene.byBuffer = (sceneFile) => {
  var scene = new Parser(sceneFile).parse()
  return scene
}

api.prepareTasks = require('./prepare-tasks.js')
api.runTask = require('./engine.js')

module.exports = api