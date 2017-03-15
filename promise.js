class Bluebird extends Promise {}

require('./promiseFns/tap')(Bluebird);
require('./promiseFns/props')(Bluebird);
require('./promiseFns/spread')(Bluebird);
require('./promiseFns/promisify')(Bluebird);
require('./promiseFns/join')(Bluebird);

module.exports = Bluebird;

