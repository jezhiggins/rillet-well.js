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

  it('populate then over-drain buffer by one- synchronous until empty then async', done => {
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

  it('overdrain multiple times', done => {
    const buffer = new EventBuffer()

    // drain
    const over = []
    for (let i = 0; i != 5; ++i)
      over.push(buffer.shift())

    Promise.all(over)
      .then(all => {
        expect(all).eql([0,1,2,3,4])
        done()
      })

    // populate
    for (let i = 0; i != 5; ++i) {
      buffer.push(i)
      expect(buffer.available).eql(false)
    }
  })

  it('revert to synchronous once overdrain promises are settled', () => {
    const buffer = new EventBuffer()

    expect(buffer.available).eql(false)

    // populate
    for (let i = 0; i != 5; ++i)
      buffer.push(i)

    // drain
    for (let i = 0; i != 5; ++i)
      expect(buffer.shift()).eql(i)
    // overdrain
    for (let i = 0; i != 5; ++i)
      expect(buffer.shift().then).to.not.be.null

    // recover the overdrain, and continue to repopulate
    for (let i = 0; i != 15; ++i)
      buffer.push(i+10)

    expect(buffer.available).eql(true)
    // drain again
    for (let i = 5; i != 15; ++i)
      expect(buffer.shift()).eql(i+10)

    expect(buffer.available).eql(false)
  })

  it('for-await when populated', async () => {
    const buffer = new EventBuffer()

    // populate
    for (let i = 0; i != 5; ++i)
      buffer.push(i)

    // drain
    let expected = 0
    for await (const v of buffer) {
      expect(v).eql(expected)
      ++expected
      if (expected === 5)
        break
    }
  })

  it('for-await when unpopulated', async () => {
    const buffer = new EventBuffer()

    // populate in the future
    for (let i = 0; i != 5; ++i)
      pause(500).then(() => buffer.push(i))

    // drain
    let expected = 0
    for await (const v of buffer) {
      expect(v).eql(expected)
      ++expected
      if (expected === 5)
        break
    }
  })

  it('for-await when populated to unpopulated', async () => {
    const buffer = new EventBuffer()

    // populate
    for (let i = 0; i != 5; ++i)
      buffer.push(i)
    for (let i = 5; i != 10; ++i)
      pause(1000).then(() => buffer.push(i))

    // drain
    let expected = 0
    for await (const v of buffer) {
      expect(v).eql(expected)
      ++expected
      if (expected === 10)
        break
    }
  })

})