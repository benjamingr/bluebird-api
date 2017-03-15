const Bluebird = require('../promise')

Bluebird.prototype.tap = function tap(onFullfiled) {
    return Bluebird.resolve((async () => {
        const value = await this;
        await onFulfilled(value);
        return value;
    })());
}