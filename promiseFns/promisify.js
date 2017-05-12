"use strict";

const util = require('./util');
// indicates to use the context of the promisified function (it's true `this`)
// like bluebird's `var THIS = {};`
const USE_THIS = Symbol("USE_THIS"); 
const IS_PROMISIFIED = Symbol("IS_PROMISIFIED");
const IDENTIFIER_REGEX = /^[a-z$_][a-z$_0-9]*$/i;
const THIS_ASSIGNMENT_PATTERN = /this\s*\.\s*\S+\s*=/;
const NO_COPY_PROPS = [
    'arity', // From BB.Firefox 4
    'length',
    'name',
    'arguments',
    'caller',
    'callee',
    'prototype',
    IS_PROMISIFIED
];

const FORBIDDEN_PROTOTYPES = [
    Array.prototype,
    Function.prototype,
    Object.prototype
];

module.exports = (Bluebird) => {
    Bluebird.promisify = function promisify(fn, { context = USE_THIS, multiArgs = false } = {}) {
        if(util.promisify && context === USE_THIS && !multiArgs) {
            let promisified = util.promisify(fn);
            return function(...args) { return Bluebird.resolve(promisified.call(this, ...args)); }
        }
        if (fn[IS_PROMISIFIED]) return fn;

        return promisifyFunction({ fn, context, multiArgs });
    };

    Bluebird.promisifyAll = function promisifyAll(obj, { context = null, multiArgs = false, suffix = "Async", filter = null, promisifier = null } = {}) {
        if (typeof suffix !== 'string' || !isIdentifier(suffix)) {
            throw new RangeError("The suffix should be a string matching [a-z$_][a-z$_0-9]*");
        }

        // promisify any class that is a property of obj
        const keys = inheritedDataKeys(obj);
        for (const key of keys) {
            const fn = obj[key];

            if (key !== 'constructor' && isClass(fn)) {
                internalPromisifyAll(fn.prototype, suffix, filter, promisifier, multiArgs);
                internalPromisifyAll(fn, suffix, filter, promisifier, multiArgs);
            }
        }
        
        return internalPromisifyAll(obj, suffix, filter, promisifier, multiArgs);
    };

    Bluebird.fromNode = // back compat alias
    Bluebird.fromCallback = function fromCallback(fn, { context = null, multiArgs = false } = {}) {
        return new Bluebird((resolve, reject) => {
            let resolver = createResolver({ resolve, reject, multiArgs });

            return fn.apply(context, [resolver]);
        });
    };

    function internalPromisifyAll(obj, suffix, filter, promisifier, multiArgs) {
        // 1. determine what to promisify.
        const functionKeys = inheritedDataKeys(obj).filter(key => shouldPromisify(key, suffix, obj, filter))

        // 2. Doooo it!
        for (const key of functionKeys) {
            let promisified;

            if (promisifier) {
                promisified = promisifier(obj[key], () => {
                    return promisifyFunction({ fn: obj[key], context: USE_THIS, multiArgs, dynamicLookupKey: key });
                });
            }
            else {
                promisified = promisifyFunction({ fn: obj[key], context: USE_THIS, multiArgs, dynamicLookupKey: key });
            }

            obj[`${key}${suffix}`] = promisified;
        }

        return obj;
    }

    // roughly equivalent to BB's makeNodePromisified()
    function promisifyFunction({ fn, context, multiArgs, dynamicLookupKey }) {
        let promisifiedFunction = function(...args) {

            if (context === USE_THIS) {
                context = this;
            }

            // dynamic lookup
            if (context && dynamicLookupKey) {
                fn = context[dynamicLookupKey];
            }

            return new Bluebird((resolve, reject) => {
                let resolver = createResolver({ resolve, reject, multiArgs });

                try {
                    return fn.apply(context, [...args, resolver]);
                }
                catch (err) {
                    reject(ensureIsError(err));
                }
            });
        }

        copyFunctionProps(fn, promisifiedFunction);
        Object.defineProperty(promisifiedFunction, IS_PROMISIFIED, { enumerable: false, value: true });

        return promisifiedFunction;
    }

    // Generate the function given to a node-style async function as the callback.
    function createResolver({ resolve, reject, multiArgs }) {
        return (err, ...values) => {
            if (err) {
                err = ensureIsError(err); // if it's primitive, make in an Error
                
                if (err instanceof Error && Object.getPrototypeOf(err) === Error.prototype) {
                    // if it's a base Error (not a custom error), make it an OperationalError
                    err = Bluebird.OperationalError.fromError(ensureIsError(err));
                }

                reject(err);
            }
            else if (multiArgs) {
                resolve(Bluebird.all(values))
            }
            else {
                resolve(values[0]);
            }
        }
    }
};

function isPromisified(fn) {
    return fn[IS_PROMISIFIED];
}

function hasPromisified(obj, key, suffix) {
    let desc = Object.getOwnPropertyDescriptor(obj, key + suffix);

    if (desc == null) return false;
    if (desc.get || desc.set) return true; // bluebird does this if there is a getter/setter. it skips that prop

    return isPromisified(desc.value);
}

function shouldPromisify(key, suffix, obj, filter) {
    const fn = obj[key];

    // must be a function
    if (typeof fn !== 'function') return false;

    // must not already be promisified
    if (isPromisified(fn) || hasPromisified(obj, key, suffix)) return false;

    //must pass filter || defaultFilter
    let passesFilter = defaultFilter(key, fn, obj, true);
    passesFilter = filter ? filter(key, fn, obj, passesFilter) : passesFilter;
    if (!passesFilter) return false;
    
    return true;
}

function isIdentifier(name) {
    return IDENTIFIER_REGEX.test(name)
}

function defaultFilter(name) {
    return isIdentifier(name) &&
        name.charAt(0) !== "_" &&
        name !== "constructor";
};

/* Bluebird rules (at least the es5+ code path):
- Get all object prop keys enumerable and now from object.
- Do the same with it's prototype (and it's prototype)
- Stop when you reach the end, or a prototype of Array, Object or Function
*/
function inheritedDataKeys(obj) {
    let foundKeys = [];
    let visitedKeys = new Set();

    // opted not to make this recursive and just loop.
    while (obj && !FORBIDDEN_PROTOTYPES.includes(obj)) {
        let keys;

        try {
            keys = Object.getOwnPropertyNames(obj);
        }
        catch (e) {
            return foundKeys;
        }

        for (const key of keys) {
            if (!visitedKeys.has(key)) {
                visitedKeys.add(key);

                let desc = Object.getOwnPropertyDescriptor(obj, key);
                if (desc != null && desc.get == null && desc.set == null) {
                    foundKeys.push(key);
                }
            }            
        }

        obj = Object.getPrototypeOf(obj);
    }

    return foundKeys;
}

// lifted from BB. only a little formatting changed.
function isClass(fn) {
    try {
        if (typeof fn === "function") {
            var keys = Object.getOwnPropertyNames(fn.prototype);

            let hasMethods = keys.length > 1;
            let hasMethodsOtherThanConstructor = keys.length > 0 && !(keys.length === 1 && keys[0] === 'constructor');
            let hasThisAssignmentAndStaticMethods = THIS_ASSIGNMENT_PATTERN.test(fn + "") && Object.getOwnPropertyNames(fn).length > 0;

            if (hasMethods || hasMethodsOtherThanConstructor ||
                hasThisAssignmentAndStaticMethods) {
                return true;
            }
        }
        return false;
    } catch (e) {
        return false;
    }
}

// Used when promisifying a function
function copyFunctionProps(from, to) {
    Object.getOwnPropertyNames(from)
        .filter(key => !NO_COPY_PROPS.includes(key))
        .map(key => ([ key, Object.getOwnPropertyDescriptor(from, key) ]))
        .forEach(([ key, propertyDescriptor ]) => Object.defineProperty(to, key, propertyDescriptor));
}

function isPrimitive(val) {
    return val == null || val === true || val === false ||
        typeof val === "string" || typeof val === "number";
}

function ensureIsError(err) {
    if (!isPrimitive(err)) return err;

    let message;

    try {
        message = err + "";
    } catch (e) {
        message = "[no string representation]";
    }

    return new Error(message);
}
