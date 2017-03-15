const Bluebird = require('../promise')

Bluebird.prototype.tap = function tap(onFullfiled) {
    return Bluebird.resolve((async () => {
        const value = await this;
        await onFulfilled(value);
        return value;
    })());
};

Bluebird.tap = function tap(promise, onFullfiled) {
    return Bluebird.resolve((async () => {
        const value = await promise;
        await onFulfilled(value);
        return value;
    })());
};