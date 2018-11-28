const EventBuffer = require('./event-buffer')

class EventStream {
  constructor (evtSource, evtName) {
    this.eventBuffer = new EventBuffer()

    const eventSink = v => this.eventBuffer.push(v)
    this.cleanUp = () => evtSource.off(evtName, eventSink)

    evtSource.on(evtName, eventSink)
  } // constructor

  async *[Symbol.asyncIterator]() {
    try {
      yield* this.eventBuffer
    } finally {
      this.cleanUp()
    }
  } // [Symbol.asyncIterator()]()

  return() {
    this.eventBuffer.return()
  }
} // class EventStream

module.exports = EventStream