const source = require('../rillet-well').source;
const { expect } = require('chai')
const { pause } = require('./helpers');

const array = [1,2,3,4,5,6,7,8];

async function* array_gn() {
  for (const i of array)
    yield i
}

async function* slow_array_gn() {
  for (const i of array) {
    await pause(100)
    yield i
  }
}

describe('toArray', () => {
  it('await source(array) toArray', async () => {
    const c = await source(array_gn()).toArray()

    expect(c).to.eql(array)
  })

  it('source(array) toArray(dest)', async () => {
    let c = await source(array_gn()).toArray()
    c = await source(array_gn()).toArray(c)

    expect(c).to.eql([1,2,3,4,5,6,7,8,1,2,3,4,5,6,7,8])
  })

  it('source(array).toArray', async () => {
    const gather = []
    source(array_gn()).toArray(gather)

    await pause()

    expect(gather).to.eql(array)
  })

  it('source(array) stopped', async () => {
    let expected = 1
    const rw = source(array_gn())
    for await (const v of rw) {
      expect(v).eql(expected)
      ++expected
      if (expected == 4)
        rw.stop()
    }
    expect(expected).eql(4)
  })

  it('source(slow_array) toArray(dest)', async () => {
    const gather = []
    source(slow_array_gn('Z')).toArray(gather)
    await pause(450)
    expect(gather).to.eql([1,2,3,4])
    await pause(400)
    expect(gather).to.eql([1,2,3,4,5,6,7,8])
  })

  it('source(slow_array) toArray(dest) stopped', async () => {
    const gather = []
    const gatherer = source(slow_array_gn('A'))
    gatherer.toArray(gather)
    await pause(350)
    gatherer.stop()
    await pause(100)
    expect(gather).to.eql([1,2,3,4])
    await pause(400)
    expect(gather).to.eql([1,2,3,4])
  })


  //t('take(4).count', source(array).take(4).count(), 4);
  //t('drop(4).count', source(array).drop(4).count(), array.length-4);
  //t('count([])', source([]).count(), 0);
});
