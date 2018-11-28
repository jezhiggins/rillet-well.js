const EventBuffer = require('../event-buffer');
const { expect } = require('chai')
const { pause } = require('./helpers');

describe('EventBuffer', () => {
  it('populate then drain buffer - entirely synchronous', () => {
    const buffer = new EventBuffer()

    expect(buffer.available).eql(false)

    // populate
    for (let i = 0; i != 5; ++i) {
      buffer.push(i)
      expect(buffer.available).eql(true)
    }

    // drain
    for (let i = 0; i != 5; ++i) {
      expect(buffer.available).eql(true)
      expect(buffer.shift()).eql(i)
    }

    expect(buffer.available).eql(false)
  })
})