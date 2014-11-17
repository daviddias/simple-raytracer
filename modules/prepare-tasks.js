var fs = require('fs');

module.exports = prepare;

function prepare(opts) {

  // if(opts.input == undefined) { throw 'Invalid Options'; }

  var split = opts.split || 10;
  var animation = opts.animation || false;
  
  // var scene = new Parser(opts.input).parse(); // Parse input
  var data = []; // 

  /* Calculate jobs sizes */
  var jobWidth = Math.floor(opts.width / split);
  var splitWidth = Math.ceil(opts.width / jobWidth);
  
  var jobHeight = Math.floor(opts.height / split);
  var splitHeight = Math.ceil(opts.height / jobHeight);

  var id = 0;
  if(animation) {
    for(var frame = 0; frame < animation.frames; frame++) {
      for(var i = 0; i < splitWidth; i++) {
        for(var j = 0; j < splitHeight; j++) {
          data.push({
            'id': id++,
            'animation': {
              'frame': frame,
              'frames': animation.frames
            },
            'begin_x': jobHeight * j,
            'end_x': j < splitHeight - 1 ? jobHeight * (j + 1) : opts.height,
            'begin_y': jobWidth * i,
            'end_y': i < splitWidth - 1 ? jobWidth * (i + 1) : opts.width
          });
        }
      }
    }
  } else {
    for(var i = 0; i < splitWidth; i++) {
      for(var j = 0; j < splitHeight; j++) {
        data.push({
          'id': id++,
          'begin_x': jobHeight * j,
          'end_x': j < splitHeight - 1 ? jobHeight * (j + 1) : opts.height,
          'begin_y': jobWidth * i,
          'end_y': i < splitWidth - 1 ? jobWidth * (i + 1) : opts.width
        });
      }
    }
  }
  return data;  
}
    