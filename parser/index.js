const { Transform } = require('stream');

var inputChunkBuffer = ""
var firstLine = true

const inputParser = new Transform({
  readableObjectMode: true,

  transform(chunk, encoding, callback) {
    // console.log('transforming')
    inputChunkBuffer += chunk
    const lines = inputChunkBuffer.split('\n');

    while (lines.length > 1) {
      var cmd

      if (firstLine) {
        cmd = parseArena(lines)
        firstLine = false
      } else {
        cmd = parseCommand(lines)
      }

      this.push(cmd)

      // put the remaining chunk data back for the next transform
      inputChunkBuffer = lines.join('\n')
    }

    callback()
  }
});

function parseArena(lines) {
  const lineParts = lines.shift().split(' ')

  const bounds = { x1: 0, y1: 0, x2: lineParts[0], y2: lineParts[1] }

  return { type: 'arena', bounds }
}

function parseCommand(lines) {
  const lineParts = lines.shift().split(' ')

  const cmd = {
    type: 'move',
    x: parseInt(lineParts[0]),
    y: parseInt(lineParts[1]),
    dir: lineParts[2],
    instructions: lines.shift().split('')
  }

  return cmd
}

module.exports = { inputParser }