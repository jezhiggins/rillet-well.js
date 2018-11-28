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

  it('populate then over-drain buffer - synchronous until empty then async', done => {
    const buffer = new EventBuffer()

    // populate
    for (let i = 0; i != 5; ++i)
      buffer.push(i)

    // drain
    for (let i = 0; i != 5; ++i)
      expect(buffer.shift()).eql(i)

    expect(buffer.available).eql(false)

    // over-drain
    const over = buffer.shift()
    expect(over.then).to.not.be.null

    over.then(v => {
      expect(v).eql('resolve')
      done()
    })

    // ok, wham something in the buffer
    buffer.push('resolve')
    // promise now resolved, buffer still empty
    buffer.available = false
  })
})