const source = require("../rillet-well.js").source;
const assert = require("assert");

const array = [1,2,3,4,5,6,7,8];

async function* array_gn() {
  for (const i of array)
    yield Promise.resolve(i)
}

async function count(rw) {
  let c = 0;
  for await (const a of rw) {
    ++c
  }
  return c
}

describe("Rillet-well", () => {
  it ('count from async generator', async () => {
    const c = await count(array_gn())
    assert.deepEqual(c, array.length)
  })

  it('count events from rillet-well', async () => {
    const c = await count(source(array_gn()))
    assert.deepEqual(c, array.length)
  })

  //t("take(4).count", source(array).take(4).count(), 4);
  //t("drop(4).count", source(array).drop(4).count(), array.length-4);
  //t("count([])", source([]).count(), 0);
});
