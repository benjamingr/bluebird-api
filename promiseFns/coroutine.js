const util = require("./util");

async function runGenerator(generator, args, thisContext) { 
    let iterator = generator.apply(thisContext, args);

    const next = ({ value, error }) => {
        if (error) {
            return iterator.throw(error);
        }
        else {
            return iterator.next(value);
        }
    }

    let value, done, error;
    do {
        ({ value, done, error } = next({ value, error }));

        if (Array.isArray(value)) {
            value = Promise.all(value);
        }
        else if (!util.isPromise(value)) {
            error = new TypeError('OMG, Not a promise.');
        }

        try {
            value = await value;
        }
        catch (ex) {
            value = undefined;
            error = ex;
        }
    } while (!done);

    return value;
}

module.exports = (Bluebird) => {
    Bluebird.coroutine = function(generator) {
        return (...args) => {
            let result;

            try {
                result = runGenerator(generator, args, this);
            }
            catch (ex) {
                return Bluebird.reject(ex);
            }

            // wrap in Promise.resolve so this returns a "fake bluebird" promise
            return Bluebird.resolve(result);
        }
    }

    Bluebird.spawn = function(generator) {
        return Bluebird.coroutine(generator)();
    }
};