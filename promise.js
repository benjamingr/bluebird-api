class Bluebird extends Promise {}


require('./promiseFns/tap')(Bluebird);
require('./promiseFns/props')(Bluebird);
require('./promiseFns/spread')(Bluebird);
require('./promiseFns/join')(Bluebird);
require('./promiseFns/try')(Bluebird);
require('./promiseFns/method')(Bluebird);
require('./promiseFns/map')(Bluebird);
require('./promiseFns/call')(Bluebird);

module.exports = Bluebird;

