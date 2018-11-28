class EventBuffer {
  constructor() {
    this.buffer = []
    this.latches = []
  } // constructor

  get available() {
    return this.buffer.length !== 0
  } // available

  push(val) {
    if (this.latches.length)
      return this.latches.shift()(val)

    this.buffer.push(val)
  } // push

  shift() {
    if (this.available)
      return this.buffer.shift()

    return new Promise(resolve => this.latches.push(resolve))
  } // pop
} // class EventBuffer

module.exports = EventBuffer;