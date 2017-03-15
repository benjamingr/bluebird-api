class Bluebird extends Promise {}

require('./promiseFns/tap')(Bluebird);

module.exports = Bluebird;

// require('./promiseFns/spread');
