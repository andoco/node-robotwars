const { inputParser } = require('./parser')
const { robotMover } = require('./mover')
const { reporter } = require('./reporter')

process.stdin.pipe(inputParser).pipe(robotMover).pipe(reporter).pipe(process.stdout);