module.exports = (opts) => {
  const split = opts.split || 10
  const animation = opts.animation || false
  const data = []

  /* Calculate jobs sizes */
  const jobWidth = Math.floor(opts.width / split)
  const splitWidth = Math.ceil(opts.width / jobWidth)

  const jobHeight = Math.floor(opts.height / split)
  const splitHeight = Math.ceil(opts.height / jobHeight)

  let id = 0
  if (animation) {
    for (let frame = 0; frame < animation.frames; frame++) {
      for (let i = 0; i < splitWidth; i++) {
        for (let j = 0; j < splitHeight; j++) {
          data.push({
            id: id++,
            animation: {
              frame: frame,
              frames: animation.frames
            },
            begin_x: jobHeight * j,
            end_x: j < splitHeight - 1 ? jobHeight * (j + 1) : opts.height,
            begin_y: jobWidth * i,
            end_y: i < splitWidth - 1 ? jobWidth * (i + 1) : opts.width
          })
        }
      }
    }
  } else {
    for (let k = 0; k < splitWidth; k++) {
      for (let z = 0; z < splitHeight; z++) {
        data.push({
          id: id++,
          begin_x: jobHeight * z,
          end_x: z < splitHeight - 1 ? jobHeight * (z + 1) : opts.height,
          begin_y: jobWidth * k,
          end_y: k < splitWidth - 1 ? jobWidth * (k + 1) : opts.width
        })
      }
    }
  }
  return data
}
