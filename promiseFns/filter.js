const util = require("./util");
module.exports = (Bluebird) => {
    Bluebird.filter = (x, predicate, opts) => Bluebird.resolve(x).filter(predicate, opts);

    Bluebird.prototype.filter = async function(predicate, {concurrency} = {}) {
        const values = await Promise.all(await this);
        if(!concurrency) {
            return await Promise.all(values.filter(predicate));
        }
        const throttled = util.throttle(predicate, Number(concurrency));
        return await Promise.all(values.filter(throttled));
    };
};

