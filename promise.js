class Bluebird extends Promise {}

Bluebird.prototype.tap = require('./promiseFns/tap');

module.exports = Bluebird;
