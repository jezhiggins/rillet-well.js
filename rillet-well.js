const EventStream = require('./lib/event-stream')

function oneEvent(evtSource, evtName) {
  let callback = null
  const p = new Promise(resolve => callback = resolve)
  evtSource.on(evtName, callback)

  let done = false

  const unattach = d => !d && evtSource.off(evtName, callback)

  return {
    async next() {
      if (done)
        return { done: true }

      const result = { value: await p, done: false };
      unattach(done);
      done = true;
      return result;
    },
    return() {
      unattach(done);
    },
    [Symbol.asyncIterator]() {
      return this;
    }
  }
} // oneEvent

async function* take(async_iter, count) {
  for await (const a of async_iter) {
    if (count === 0)
      break;
    --count;
    yield a;
  } // for
} // take

////////////////////
class RilletWell {
  static source(async_iter) {
    return new RilletWell(async_iter);
  } // source

  static fromEvent(evtSource, evtName) {
    return new RilletWell(oneEvent(evtSource, evtName));
  } // fromEvent

  static fromEvents(evtSource, evtName) {
    return new RilletWell(new EventStream(evtSource, evtName));
  } // fromEvent

  constructor(async_iter) {
    this.async_iter = async_iter
  } // constructor

  async *[Symbol.asyncIterator]() {
    yield* this.async_iter
  }

  stop() {
    this.async_iter.return();
  }

  take(count) { return new RilletWell(take(this.async_iter, count)); }

  async toArray(dest = []) {
    for await (const v of this) {
      dest.push(v)
      console.log('Boop')
    }
    return dest
  } // toArray
} // class RilletWell

module.exports = RilletWell
