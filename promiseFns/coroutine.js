module.exports = (Bluebird) => {
    Bluebird.coroutine = function(generator) {
        return async function(...args) {
            let iterator = generator.apply(null, args);

            let value, done;
            do {
                ({ value, done } = iterator.next(value));

                value = await value;
            } while (!done);

            return value;
        }
    }
};