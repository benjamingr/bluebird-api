module.exports = (Bluebird) => {
    Bluebird.try = function(fn) {
        if(typeof fn !== 'function') {
            return Bluebird.reject(new TypeError("fn must be a function"));
        }
        return Bluebird.resolve().then(fn);
    };
};