const { inputParser } = require('../parser')
const { robotMover } = require('../mover')
const { reporter } = require('../reporter')
var MemoryStream = require('memorystream')

const input = `55
1 2 N
LMLMLMLMM
3 3 E
MMRMMRMRRM`

const output = `1 3 N
5 1 E
`

describe('Robot wars pipeline', () => {
  it('should prodocue expected output', async () => {
    var inMemStream = new MemoryStream([], { writable: true, readable: true })
    var outMemStream = new MemoryStream([], { writable: true, readable: false })

    inMemStream
      .pipe(inputParser)
      .pipe(robotMover)
      .pipe(reporter)
      .pipe(outMemStream)
      .on('finish', () => {
        expect(outMemStream.toString()).toBe(output)
      })

    inMemStream.end(input)
  })
})