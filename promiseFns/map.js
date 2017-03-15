const util = require("./util");
module.exports = (Bluebird) => {
    Bluebird.map = (x, mapper, opts) => Bluebird.resolve(x).map(mapper, opts);

    Bluebird.prototype.map = async function(mapper, {concurrency} = {}) {
        const values = await Promise.all(await this);
        if(!concurrency) {
            return await Promise.all(values.map(mapper));
        }
        const throttled = util.throttle(mapper, Number(concurrency));
        return await Promise.all(values.map(throttled));
    };
};

