// indicates to use the context of the promisified function (it's true `this`)
// like bluebird's `var THIS = {};`
const USE_THIS = Symbol("USE_THIS"); 
const SUFFIX_REGEX = /^[a-z$_][a-z$_0-9]*$/i;

module.exports = (Bluebird) => {
    Bluebird.promisify = function promisify(fn, { context = USE_THIS, multiArgs = false } = {}) {
        return promisifyFunction({ fn, context, multiArgs });
    };

    Bluebird.promisifyAll = function promisifyAll(obj, { context = null, multiArgs = false, suffix = "Async" } = {}) {
        if (typeof suffix !== 'string' || !SUFFIX_REGEX.test(suffix)) {
            throw new RangeError("The suffix should be a string matching [a-z$_][a-z$_0-9]*");
        }

        const functionKeys = getFunctionsToPromisify(obj);

        for (const key of functionKeys) {
            obj[`${key}${suffix}`] = promisifyFunction({ fn: obj[key], context: USE_THIS, multiArgs, dynamicLookupKey: key });
        }
        
        return obj;
    };

    function promisifyFunction({ fn, context, multiArgs, dynamicLookupKey }) {
        return function(...args) {

            if (context === USE_THIS) {
                context = this;
            }

            // dynamic lookup
            if (dynamicLookupKey) {
                fn = context[dynamicLookupKey];
            }

            return new Bluebird((resolve, reject) => {
                let resolver = createResolver({ resolve, reject, multiArgs });

                return fn.apply(context, [...args, resolver]);
            });
        }
    }

    function createResolver({ resolve, reject, multiArgs }) {
        return multiArgs ?
            (err, ...values) => err ? reject(err) : resolve(values) :
            (err, value) => err ? reject(err) : resolve(value);
    }

    function getFunctionsToPromisify(obj) {
        return Object.keys(obj).filter(key => typeof(obj[key]) === 'function');
    }
};

