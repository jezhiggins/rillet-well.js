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

async function* eventStream(evtSource, evtName) {
  let callback = null
  let p = new Promise(resolve => callback = resolve)
  const eventSink = v => callback(v)

  try {
    evtSource.on(evtName, eventSink)

    while (true) {
      yield p

      p = new Promise(resolve => callback = resolve)
    } // while
  } finally {
    evtSource.off(evtName, eventSink)
    callback = null
  }
} // eventer

////////////////////
class RilletWell {
  static source(async_iter) {
    return new RilletWell(async_iter);
  } // source

  static fromEvent(evtSource, evtName) {
    return new RilletWell(oneEvent(evtSource, evtName));
  } // fromEvent

  static fromEvents(evtSource, evtName) {
    return new RilletWell(eventStream(evtSource, evtName));
  } // fromEvent

  constructor(async_iter) {
    this.async_iter = async_iter
  } // constructor

  [Symbol.asyncIterator]() {
    return this.async_iter;
  }

  stop() {
    this.async_iter.return();
  }

  async toArray(dest = []) {
    for await (const v of this)
      dest.push(v)
    return dest
  } // toArray
} // class RilletWell

module.exports = RilletWell
