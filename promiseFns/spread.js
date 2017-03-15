const Bluebird = require('../promise')

Bluebird.prototype.spread = function spread(fn) {
    return Bluebird.resolve((async () => {
        const value = await this;
        if (!Array.isArray(value)) { throw new Error('Array expected.'); }
        return fn(...value);
    })());
}