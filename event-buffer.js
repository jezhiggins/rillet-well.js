class EventBuffer {
  constructor() {
    this.buffer = []
    this.latch = null
  } // constructor

  get available() {
    return this.buffer.length !== 0
  } // available

  push(val) {
    if (this.latch)
      return this.latch(val)

    this.buffer.push(val)
  } // push

  shift() {
    if (this.available)
      return this.buffer.shift()

    const p = new Promise(resolve => this.latch = resolve)
    return p
  } // pop
} // class EventBuffer

module.exports = EventBuffer;