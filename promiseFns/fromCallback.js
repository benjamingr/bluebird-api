module.exports = (Bluebird) => {
    Bluebird.fromCallback = function fromCallback(fn, { context = null, multiArgs = false } = {}) {
        return new Bluebird((resolve, reject) => {
            const resolver = multiArgs ?
                (err, ...values) => err ? reject(err) : resolve(values) :
                (err, value) => err ? reject(err) : resolve(value);

            return fn.apply(context, [resolver]);
        });
    };

    Bluebird.fromNode = Bluebird.fromCallback;
};