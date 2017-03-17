const util = require("./util");

let yieldHandlers = [];

async function runGenerator(generator, args, yieldHandlers, thisContext) { 
    let iterator = generator.apply(thisContext, args);

    // Loop state
    let value = undefined
    let done = false;
    let errorMode = false;
    let error = undefined;

    do {
        // 1. Advance iterator to next 'step'
        ({ value, done } = nextStep({ iterator, value, error, errorMode }));

        // 2. Process the yielded value
        // Only if !done, since the returned values are not processed like yielded ones.
        if (!done) {
            ({ value, error, errorMode } = await processValue({ value, yieldHandlers }));
        }
    } while (!done);

    return value;
}

// perform the next 'step' in iterator based on the current state (e.g. errorMode)
function nextStep({ iterator, value, error, errorMode }) {
    if (errorMode) {
        return iterator.throw(error);
    }
    else {
        return iterator.next(value);
    }
}
 
// process a yielded value, pass through yieldHandlers, record error if (value as Promise) rejects.
async function processValue({ value, yieldHandlers }) {
    try {
        // run through all yieldHandlers
        for (const yieldHandler of yieldHandlers) {
            let handlerResult = yieldHandler(value);

            // only replace our value if the handler returned something
            // (it's supposed to be a promise, but I check that later)
            if (handlerResult) {
                value = handlerResult;
                break;
            }
        }

        if (!util.isPromise(value)) {
            throw new TypeError('OMG, Not a promise.');
        }

        value = await value;
        return {
            value,
            error: undefined,
            errorMode: false
        };
    }
    catch (ex) {
        return {
            value: undefined,
            error: ex,
            errorMode: true
        };
    }
}

module.exports = (Bluebird) => {
    Bluebird.coroutine = function(generator, { yieldHandler = null } = {}) {

        return function(...args) {

            // add the provded yieldHandler to the global onces, if provided.
            let allYieldHandlers;
            if (yieldHandler) {
                allYieldHandlers = [...yieldHandlers, yieldHandler];
            }
            else {
                allYieldHandlers = yieldHandlers;
            }
            
            let result = runGenerator(generator, args, allYieldHandlers, this);

            // native async/await returns a native promise,
            // so wrap in Promise.resolve so this returns a "fake bluebird" promise instance
            return Bluebird.resolve(result);
        }
    };

    Bluebird.coroutine.addYieldHandler = function(newYieldHandler) {
        if (!newYieldHandler || typeof(newYieldHandler) !== 'function') {
            throw new TypeError('yieldHandler must be a function.');
        }
        
        yieldHandlers.push(newYieldHandler);
    }

    Bluebird.spawn = function(generator) {
        return Bluebird.coroutine(generator)();
    };
};