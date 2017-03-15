class Bluebird extends Promise {}

require('./promiseFns/tap')(Bluebird);
require('./promiseFns/props')(Bluebird);
require('./promiseFns/spread')(Bluebird);
require('./promiseFns/get')(Bluebird);

module.exports = Bluebird;

