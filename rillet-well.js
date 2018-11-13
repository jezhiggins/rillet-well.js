////////////////////
class RilletWell {
  static source(async_iter) {
    return new RilletWell(async_iter)
  } // source

  constructor(async_iter) {
    this.async_iter = async_iter
  } // constructor

  async *[Symbol.asyncIterator]() {
    yield* this.async_iter;
  }
} // RilletWell

module.exports = RilletWell