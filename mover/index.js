const { Transform } = require('stream');

var bounds

const robotMover = new Transform({
  writableObjectMode: true,
  readableObjectMode: true,

  transform(cmd, encoding, callback) {
    switch (cmd.type) {
      case 'arena':
        handleArenaCmd(cmd)
        break;
      case 'move':
        handleMoveCmd(cmd, this)
        break
    }

    callback()
  }
})

function handleArenaCmd(cmd) {
  bounds = cmd.bounds
}

function handleMoveCmd({ x, y, dir, instructions }, stream) {
  for (var i = 0; i < instructions.length; i++) {
    switch (instructions[i]) {
      case 'M':
        [x, y] = moveForward(x, y, dir)
        break
      case 'L':
        dir = rotateLeft(dir)
        break
      case 'R':
        dir = rotateRight(dir)
        break
    }

    if (x < bounds.x1 || x > bounds.x2 || y < bounds.y1 || y > bounds.y2) {
      stream.emit('error', 'Robot has moved outside the bounds of the arena')
    }
  }

  stream.push({ x: x, y: y, dir: dir })
}

function moveForward(x, y, dir) {
  switch (dir) {
    case 'N':
      y += 1;
      break;
    case 'E':
      x += 1;
      break;
    case 'S':
      y -= 1;
      break;
    case 'W':
      x -= 1;
      break;
  }

  return [x, y]
}

function rotateLeft(dir) {
  switch (dir) {
    case 'N': return 'W'
    case 'E': return 'N'
    case 'S': return 'E'
    case 'W': return 'S'
  }
}

function rotateRight(dir) {
  switch (dir) {
    case 'N': return 'E'
    case 'E': return 'S'
    case 'S': return 'W'
    case 'W': return 'N'
  }
}

module.exports = { robotMover }