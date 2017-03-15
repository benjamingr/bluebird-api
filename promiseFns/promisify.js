module.exports = (Bluebird) => {
    Bluebird.promisify = function promisify(fn, thisArg = null) {
        return function (...args) {
            return new Bluebird((resolve, reject) => console.log([...args, (err, value) => err ? reject(err) : resolve(value)]) || 
                fn.apply(thisArg, [...args, (err, value) => err ? reject(err) : resolve(value)]));
        }
    };
};

