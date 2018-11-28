class EventBuffer {
  constructor() {
    this.buffer = []
    this.latches = []
    this.stopped = false
  } // constructor

  get available() {
    return this.buffer.length !== 0
  } // available

  push(val) {
    if (this.latches.length)
      return this.latches.shift()(val)

    if (this.stopped)
      return

    this.buffer.push(val)
  } // push

  shift() {
    if (this.available)
      return this.buffer.shift()

    if (this.stopped)
      return

    return new Promise(resolve => this.latches.push(resolve))
  } // pop

  async *[Symbol.asyncIterator]() {
    while(this.available || !this.stopped)
      yield this.shift()
  }

  return() {
    this.stopped = true
  }
} // class EventBuffer

module.exports = EventBuffer;