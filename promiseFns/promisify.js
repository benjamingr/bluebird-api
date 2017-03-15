module.exports = (Bluebird) => {
    Bluebird.promisify = function promisify(fn, { context = null, multiArgs = false } = {}) {
        return function (...args) {
            return new Bluebird((resolve, reject) => {
                const resolver = multiArgs ?
                    (err, ...values) => err ? reject(err) : resolve(values) :
                    (err, value) => err ? reject(err) : resolve(value);

                return fn.apply(context, [...args, resolver]);
            });
        }
    };
};

