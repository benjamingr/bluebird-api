module.exports = (Bluebird) => {
    Bluebird.prototype.disposer = function disposer(fn) {
        return {
            _use: this,
            _cleanup: fn,
            then() { 
                throw new Error("A disposer is not a promise. Use it with `Promise.using`.")
            }
        };
    };
};