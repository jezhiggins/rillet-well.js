const { fromEvent, fromEvents } = require('../rillet-well')
const { expect } = require('chai')
const { pause } = require('./helpers');

class EventSource {
  constructor() {
    this.eventName = null;
    this.eventSink = null;
  }

  on(name, callback) {
    this.eventName = name;
    this.eventSink = callback;
  }

  off(name, callback) {
    expect(name).to.equal(this.eventName)
    expect(callback).to.equal(this.eventSink)
  }

  evt(value) {
    if (this.eventSink)
      this.eventSink(value);
  }
} // EventSource

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
    const gatherer = capturer.toArray()

    for (let i = 1; i != 5; ++i) {
      await pause()
      eventer.evt(i*i)
    }

    capturer.stop()
    const gathered = await gatherer

    expect(gathered).to.eql([1, 4, 9, 16])
  })

  xit ('fromEvents(s, n)', async () => {
    const eventer = new EventSource()

    const reactor = fromEvents(eventer, 'ping')

    for (let i = 1; i != 5; ++i)
      eventer.evt(i*i)

    const result = []
    for await (const v of reactor)
      result.push(v)

    expect(result).to.eql([1, 4, 9, 16])
  })
})
