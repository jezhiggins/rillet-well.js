const assert = require('assert');
const { timer, pause } = require('./helpers');

describe('test helpers', () => {
  it('timer and pause', async () => {
    const t = timer()

    for (let i = 100; i !== 500; i += 100) {
      await pause(100)

      const elapsed = t.elapsed() * 1000

      assert(elapsed > i)
      assert(elapsed < i+50)
    }
  })
})

