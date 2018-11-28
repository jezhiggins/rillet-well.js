class EventBuffer {
  constructor() {
    this.buffer = []
  } // constructor

  get available() {
    return this.buffer.length !== 0
  } // available

  push(val) {
    this.buffer.push(val)
  } // push

  shift() {
    return this.buffer.shift()
  } // pop
} // class EventBuffer

module.exports = EventBuffer;