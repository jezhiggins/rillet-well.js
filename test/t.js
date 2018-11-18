const assert = require('assert');
const { DateTime } = require('luxon')

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

module.exports = {
  compareSequences,
  timer,
  pause
};
