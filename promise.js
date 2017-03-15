class Bluebird extends Promise {}

require('./promiseFns/tap')(Bluebird);
require('./promiseFns/spread')(Bluebird);

module.exports = Bluebird;

