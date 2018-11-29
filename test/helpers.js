const assert = require('assert');
const { DateTime } = require('luxon')
const { expect } = require('chai')

function compareSequences(msg, src, expected) {
  const result = (src && src.toArray) ? src.toArray() : src;

  if (Number.isNaN(expected))
    return it(msg, () => assert.ok(Number.isNaN(result)));

  it(msg, () => assert.deepStrictEqual(result, expected));
} // compareSequences


class Timer {
  constructor() {
    this.start = DateTime.local();
  }

  elapsed() {
    const now = DateTime.local();
    return now.diff(this.start, 'seconds').toObject().seconds
  }
} // class Timer

function timer() {
  return new Timer()
} // timer

function pause(p = 1) {
  return new Promise(resolve => setTimeout(resolve, p))
} // pause

class EventSource {
  constructor() {
    this.eventName = null;
    this.eventSink = null;
  }

  on(name, callback) {
    this.eventName = name;
    this.eventSink = callback;
  }

  off(name, callback) {
    expect(name).to.equal(this.eventName)
    expect(callback).to.equal(this.eventSink)
  }

  evt(value) {
    if (this.eventSink)
      this.eventSink(value);
  }
} // EventSource

module.exports = {
  compareSequences,
  timer,
  pause,
  EventSource
};
