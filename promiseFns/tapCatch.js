module.exports = (Bluebird) => {
    Bluebird.prototype.tapCatch = function(onResolved) {
        return tapCatch.call(this, ...arguments)
    };

    Bluebird.tapCatch = function(promise, onResolved) {
        return tapCatch.call(promise, ...arguments)
    };
};

function tapCatch(onResolved) {
    if (arguments.length > 1) {
        const filters = Array.prototype.slice.call(arguments, 0, -1);
        onResolved = arguments[arguments.length - 1];
        return this.catch(...filters, tapCatchCallback(onResolved));
    }
    return this.catch(tapCatchCallback(onResolved));
};

const tapCatchCallback = (onResolved) =>
    async err => {
        await onResolved(err);
        throw err;
    }