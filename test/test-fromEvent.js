const { fromEvent, fromEvents } = require('../rillet-well')
const { expect } = require('chai')
const { pause, EventSource } = require('./helpers');

describe('fromEvent', () => {
  it('fromEvent(s, n) toArray', async () => {
    const eventer = new EventSource()
    const gather = []

    fromEvent(eventer, 'ping').toArray(gather)

    await pause()
    eventer.evt('woo')
    await pause()

    expect(gather).to.eql(['woo'])
  })

  it('fromEvent(s, n)', async () => {
    const eventer = new EventSource()

    const reactor = fromEvent(eventer, 'ping')

    eventer.evt('hooray')

    const result = []
    for await (const v of reactor)
      result.push(v)

    expect(result).to.eql(['hooray'])
  })
})

describe('fromEvents', () => {
  it ('fromEvents(s, n) toArray', async () => {
    const eventer = new EventSource()
    const gather = []

    fromEvents(eventer, 'ping').toArray(gather)

    for (let i = 1; i != 5; ++i) {
      await pause()
      eventer.evt(i*i)
    }
    await pause()

    expect(gather).to.eql([1, 4, 9, 16])
  })

  it ('fromEvents(s, n) toArray()', async () => {
    const eventer = new EventSource()
    const capturer = fromEvents(eventer, 'ping')

    for (let i = 1; i != 5; ++i) {
      await pause()
      eventer.evt(i*i)
    }

    capturer.stop()
    const gathered = await capturer.toArray()

    expect(gathered).to.eql([1, 4, 9, 16])
  })

  it ('fromEvents(s, n)', async () => {
    const eventer = new EventSource()

    const reactor = fromEvents(eventer, 'ping')
    for (let i = 1; i !== 5; ++i)
      eventer.evt(i*i)

    const result = []
    for await (const v of reactor) {
      result.push(v)
      if (result.length === 4)
        break
    }

    expect(result).to.eql([1, 4, 9, 16])
  })
})
