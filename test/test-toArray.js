const source = require("../rillet-well.js").source;
const assert = require("assert");

const array = [1,2,3,4,5,6,7,8];

async function* array_gn() {
  for (const i of array)
    yield Promise.resolve(i)
}

describe("toArray", () => {
  it('await source(array) toArray', async () => {
    const c = await source(array_gn()).toArray()
    assert.deepEqual(c, array)
  })

  it('source(array) toArray(dest)', async () => {
    let c = await source(array_gn()).toArray()
    c = await source(array_gn()).toArray(c)

    assert.deepEqual(c, [1,2,3,4,5,6,7,8,1,2,3,4,5,6,7,8])
  })

  it('source(array).toArray', async () => {
    const gather = []
    source(array_gn()).toArray(gather)

    await pause()

    assert.deepEqual(gather, array)
  })

  //t("take(4).count", source(array).take(4).count(), 4);
  //t("drop(4).count", source(array).drop(4).count(), array.length-4);
  //t("count([])", source([]).count(), 0);
});

function pause() {
  return new Promise(resolve => setTimeout(resolve, 1))
}