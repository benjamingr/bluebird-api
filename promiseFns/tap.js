module.exports = (Bluebird) => {
    Bluebird.prototype.tap = function tap(onFullfiled) {
        return Bluebird.resolve((async () => {
            const value = await this;
            console.log(value);
            await onFullfiled(value);
            return value;
        })());
    };

    Bluebird.tap = function tap(promise, onFullfiled) {
        return Bluebird.resolve((async () => {
            const value = await promise;
            await onFullfiled(value);
            return value;
        })());
    };
};