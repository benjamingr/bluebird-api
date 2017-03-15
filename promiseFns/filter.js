module.exports = (Bluebird) => {
    Bluebird.prototype.tap = function tap(fn) {
        return Bluebird.resolve((async () => {
            const value = await this;
		    return value.filter(fn)
        })());
    };

    Bluebird.tap = function tap(promise, fn) {
        return Bluebird.resolve((async () => {
            const value = await promise;
		    return value.filter(fn)
        })());
    };
};