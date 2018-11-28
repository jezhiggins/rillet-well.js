const source = require('../rillet-well').source;
const { expect } = require('chai')
const { pause } = require('./helpers');

const array = [1,2,3,4,5,6,7,8];

async function* array_gn() {
  for (const i of array)
    yield Promise.resolve(i)
}

async function* slow_array_gn() {
  for (const i of array) {
    yield Promise.resolve(i)
    await pause(100)
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

  it('source(slow_array) toArray(dest)', async () => {
    const gather = []
    source(slow_array_gn()).toArray(gather)
    await pause(400)
    expect(gather).to.eql([1,2,3,4])
    await pause(400)
    expect(gather).to.eql([1,2,3,4,5,6,7,8])
  })

  //t('take(4).count', source(array).take(4).count(), 4);
  //t('drop(4).count', source(array).drop(4).count(), array.length-4);
  //t('count([])', source([]).count(), 0);
});
