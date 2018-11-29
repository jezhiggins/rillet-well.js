const { source, fromEvents } = require('../rillet-well');
const { expect } = require('chai')
const { pause, EventSource } = require('./helpers');

describe('take', () => {
  it('source(array).take.toArray', async () => {
    const c = await source([1,2,3,4,5,6,7,8]).take(4).toArray()

    expect(c).to.eql([1,2,3,4])
  })

  it('source(array).take', async () => {
    const c = []
    for await (const v of source([1,2,3,4,5,6,7,8]).take(4))
      c.push(v)
    expect(c).to.eql([1,2,3,4])
  })

  it('source(events).take.toArray', async () => {
    const eventer = new EventSource()
    const c = fromEvents(eventer, 'ping').take(4).toArray()

    for (let i = 1; i != 10; ++i) {
      await pause()
      eventer.evt(i*i)
    }
    await pause()

    expect(await c).to.eql([1, 4, 9, 16])
  })

  it('source(events).take', async () => {
    const eventer = new EventSource()

    const c = []
    fromEvents(eventer, 'ping').take(4).toArray(c)

    eventer.evt(1)
    await pause()
    expect(c).to.eql([1])

    for (let i = 2; i != 10; ++i)
      eventer.evt(i*i)
    await pause()

    expect(c).to.eql([1, 4, 9, 16])
  })
})
