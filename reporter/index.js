const { Transform } = require('stream');

const reporter = new Transform({
  readableObjectMode: true,
  writableObjectMode: true,

  transform({ x, y, dir }, encoding, callback) {
    this.push(`${x} ${y} ${dir}\n`)
    callback()
  }
})

module.exports = { reporter }