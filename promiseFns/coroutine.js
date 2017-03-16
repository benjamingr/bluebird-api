const util = require("./util");

async function runGenerator(generator, args, thisContext) { 
    let iterator = generator.apply(thisContext, args);

    const next = ({ value, error, errorMode }) => {
        if (errorMode) {
            return iterator.throw(error);
        }
        else {
            return iterator.next(value);
        }
    }

    let value, done, errorMode, error;
    do {
        // get next value then reset next() input variables
        ({ value, done } = next({ value, error, errorMode }));
        errorMode = false; // I need this boolean instead of `Boolean(error)` since some people `throw undefined;` evidently..
        error = undefined;


        if (Array.isArray(value)) {
            value = Promise.all(value);
        }
        else if (!util.isPromise(value)) {
            error = new TypeError('OMG, Not a promise.');
            errorMode = true;
        }

        try {
            value = await value;
        }
        catch (ex) {
            value = undefined;
            error = ex;
            errorMode = true;
        }
    } while (!done);

    return value;
}

module.exports = (Bluebird) => {
    Bluebird.coroutine = function(generator) {
        return function(...args) {
            let result;

            // native async/await returns a native promise, so...
            result = runGenerator(generator, args, this);

            // ... wrap in Promise.resolve so this returns a "fake bluebird" promise
            return Bluebird.resolve(result);
        }
    }

    Bluebird.spawn = function(generator) {
        return Bluebird.coroutine(generator)();
    }
};