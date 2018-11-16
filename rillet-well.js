////////////////////
class RilletWell {
  static source(async_iter) {
    return new RilletWell(async_iter)
  } // source

  constructor(async_iter) {
    this.async_iter = async_iter
  } // constructor

  async* [Symbol.asyncIterator]() {
    yield* this.async_iter;
  }

  async toArray(dest = []) {
    for await (const v of this)
      dest.push(v)
    return dest
  } // toArray
} // class RilletWell

module.exports = RilletWell
