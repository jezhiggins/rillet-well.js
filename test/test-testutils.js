const { expect } = require('chai');
const { timer, pause } = require('./helpers');

describe('test helpers', () => {
  it('timer and pause', async () => {
    const t = timer()

    for (let i = 100; i !== 500; i += 100) {
      await pause(100)

      const elapsed = t.elapsed() * 1000

      expect(elapsed).to.be.above(i)
      expect(elapsed).to.not.be.above(i+50)
    }
  })
})

