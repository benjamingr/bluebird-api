/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = {
    throttle,
    isPromise,
    isObject,
    classString
};

// slow implementation to start with. Should be "fast enough" for small concurrency values < 100;
function throttle(fn, concurrency = 20) {
    const workers = Array(concurrency).fill(Promise.resolve());
    const work = [];
    return function (...args) {
        const worker = workers.pop();
        if (worker === undefined) {
            let resolve, reject;
            const promise = new Promise((res, rej) => {
                resolve = res;
                reject = rej;
            });
            work.unshift({ args, resolve, reject, promise });
            return promise;
        }
        worker = worker.then(() => (fn(...args), null));
        worker.then(function pump() {
            if (work.length) {
                const {resolve, reject, args} = work.pop();
                worker = worker.then(() => fn(...args)).then(resolve, reject).then(pump);
            } else {
                workers.push(worker);
            }
            return null;
        });
        return worker;
    }
}

function isPromise(obj) {
    return obj && obj.then && (typeof(obj.then) === 'function');
}


function classString(obj) {
    return {}.toString.call(obj);
}

function isObject(value) {
    return typeof value === "function" ||
           typeof value === "object" && value !== null;
}

/***/ }),
/* 1 */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = function (Bluebird) {
     class OperationalError extends Error {
         constructor(message) {
             super(message);
        }
        get isOperational() {
            return true;
        }

        static fromError(err) {
            return Object.assign(new OperationalError(err.message), {
                stack: err.stack
            });
        }
    };
    Bluebird.OperationalError = OperationalError;
};

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process, setImmediate) {if(typeof process !== "undefined" && typeof process.nextTick === "function") {
    module.exports = process.nextTick;
} else if (typeof setImmediate === "function") {
    module.exports = setImmediate;
} else {
    module.exports = setTimeout;
}
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1), __webpack_require__(7).setImmediate))

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

function factory() {
    class Bluebird extends Promise { }
    Bluebird.TypeError = TypeError; // Bluebird.TypeError is used in tests

    __webpack_require__(2)(Bluebird);
    __webpack_require__(9)(Bluebird);
    __webpack_require__(10)(Bluebird);

    __webpack_require__(20)(Bluebird);
    __webpack_require__(46)(Bluebird);
    __webpack_require__(43)(Bluebird);
    __webpack_require__(35)(Bluebird);
    __webpack_require__(41)(Bluebird);
    __webpack_require__(34)(Bluebird);
    __webpack_require__(28)(Bluebird);
    __webpack_require__(47)(Bluebird);
    __webpack_require__(31)(Bluebird);
    __webpack_require__(23)(Bluebird);
    __webpack_require__(30)(Bluebird);
    __webpack_require__(29)(Bluebird);
    __webpack_require__(25)(Bluebird);
    __webpack_require__(27)(Bluebird);
    __webpack_require__(13)(Bluebird);
    __webpack_require__(37)(Bluebird);
    __webpack_require__(26)(Bluebird);
    __webpack_require__(38)(Bluebird);
    __webpack_require__(36)(Bluebird);
    __webpack_require__(45)(Bluebird);
    __webpack_require__(16)(Bluebird);
    __webpack_require__(17)(Bluebird);
    __webpack_require__(15)(Bluebird);
    __webpack_require__(24)(Bluebird);
    __webpack_require__(18)(Bluebird);
    __webpack_require__(14)(Bluebird);
    __webpack_require__(12)(Bluebird);
    __webpack_require__(32)(Bluebird);
    __webpack_require__(19)(Bluebird);
    __webpack_require__(22)(Bluebird);
    __webpack_require__(42)(Bluebird);
    __webpack_require__(33)(Bluebird);
    __webpack_require__(40)(Bluebird);
    __webpack_require__(11)(Bluebird);
    __webpack_require__(21)(Bluebird);
    __webpack_require__(48)(Bluebird);
    __webpack_require__(44)(Bluebird);

    const logger = {log: console.warn, active: true};
    //const warningThen = require("./promiseFns/then")(Bluebird, logger);

    __webpack_require__(39)(Bluebird);
    Bluebird.config = (obj) => {
        // if(!obj.warnings) {
        //     logger.active = false;
        // } else {
        //     logger.active = true;
        // }
    };
    Bluebird.longStackTraces = () => {}; // long stack traces by debugger and not bb
    Bluebird.hasLongStackTraces = () => false;

    // converted from async to traditional .then() since native async/await return native promises.
    Bluebird.prototype.all = function all() {
        return this.then(r => Bluebird.all(r));
    };

    return Bluebird;
}
const copy = factory();
copy.getNewLibraryCopy = () => {
    const newCopy = factory();
    newCopy.getNewLibraryCopy = copy.getNewLibraryCopy;
    return newCopy;
};

module.exports = copy;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

const Bluebird = __webpack_require__(4);
module.exports = Bluebird

if (typeof window !== 'undefined') {
    window.Bluebird = Bluebird;
}

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global, process) {(function (global, undefined) {
    "use strict";

    if (global.setImmediate) {
        return;
    }

    var nextHandle = 1; // Spec says greater than zero
    var tasksByHandle = {};
    var currentlyRunningATask = false;
    var doc = global.document;
    var registerImmediate;

    function setImmediate(callback) {
      // Callback can either be a function or a string
      if (typeof callback !== "function") {
        callback = new Function("" + callback);
      }
      // Copy function arguments
      var args = new Array(arguments.length - 1);
      for (var i = 0; i < args.length; i++) {
          args[i] = arguments[i + 1];
      }
      // Store and register the task
      var task = { callback: callback, args: args };
      tasksByHandle[nextHandle] = task;
      registerImmediate(nextHandle);
      return nextHandle++;
    }

    function clearImmediate(handle) {
        delete tasksByHandle[handle];
    }

    function run(task) {
        var callback = task.callback;
        var args = task.args;
        switch (args.length) {
        case 0:
            callback();
            break;
        case 1:
            callback(args[0]);
            break;
        case 2:
            callback(args[0], args[1]);
            break;
        case 3:
            callback(args[0], args[1], args[2]);
            break;
        default:
            callback.apply(undefined, args);
            break;
        }
    }

    function runIfPresent(handle) {
        // From the spec: "Wait until any invocations of this algorithm started before this one have completed."
        // So if we're currently running a task, we'll need to delay this invocation.
        if (currentlyRunningATask) {
            // Delay by doing a setTimeout. setImmediate was tried instead, but in Firefox 7 it generated a
            // "too much recursion" error.
            setTimeout(runIfPresent, 0, handle);
        } else {
            var task = tasksByHandle[handle];
            if (task) {
                currentlyRunningATask = true;
                try {
                    run(task);
                } finally {
                    clearImmediate(handle);
                    currentlyRunningATask = false;
                }
            }
        }
    }

    function installNextTickImplementation() {
        registerImmediate = function(handle) {
            process.nextTick(function () { runIfPresent(handle); });
        };
    }

    function canUsePostMessage() {
        // The test against `importScripts` prevents this implementation from being installed inside a web worker,
        // where `global.postMessage` means something completely different and can't be used for this purpose.
        if (global.postMessage && !global.importScripts) {
            var postMessageIsAsynchronous = true;
            var oldOnMessage = global.onmessage;
            global.onmessage = function() {
                postMessageIsAsynchronous = false;
            };
            global.postMessage("", "*");
            global.onmessage = oldOnMessage;
            return postMessageIsAsynchronous;
        }
    }

    function installPostMessageImplementation() {
        // Installs an event handler on `global` for the `message` event: see
        // * https://developer.mozilla.org/en/DOM/window.postMessage
        // * http://www.whatwg.org/specs/web-apps/current-work/multipage/comms.html#crossDocumentMessages

        var messagePrefix = "setImmediate$" + Math.random() + "$";
        var onGlobalMessage = function(event) {
            if (event.source === global &&
                typeof event.data === "string" &&
                event.data.indexOf(messagePrefix) === 0) {
                runIfPresent(+event.data.slice(messagePrefix.length));
            }
        };

        if (global.addEventListener) {
            global.addEventListener("message", onGlobalMessage, false);
        } else {
            global.attachEvent("onmessage", onGlobalMessage);
        }

        registerImmediate = function(handle) {
            global.postMessage(messagePrefix + handle, "*");
        };
    }

    function installMessageChannelImplementation() {
        var channel = new MessageChannel();
        channel.port1.onmessage = function(event) {
            var handle = event.data;
            runIfPresent(handle);
        };

        registerImmediate = function(handle) {
            channel.port2.postMessage(handle);
        };
    }

    function installReadyStateChangeImplementation() {
        var html = doc.documentElement;
        registerImmediate = function(handle) {
            // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
            // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
            var script = doc.createElement("script");
            script.onreadystatechange = function () {
                runIfPresent(handle);
                script.onreadystatechange = null;
                html.removeChild(script);
                script = null;
            };
            html.appendChild(script);
        };
    }

    function installSetTimeoutImplementation() {
        registerImmediate = function(handle) {
            setTimeout(runIfPresent, 0, handle);
        };
    }

    // If supported, we should attach to the prototype of global, since that is where setTimeout et al. live.
    var attachTo = Object.getPrototypeOf && Object.getPrototypeOf(global);
    attachTo = attachTo && attachTo.setTimeout ? attachTo : global;

    // Don't get fooled by e.g. browserify environments.
    if ({}.toString.call(global.process) === "[object process]") {
        // For Node.js before 0.9
        installNextTickImplementation();

    } else if (canUsePostMessage()) {
        // For non-IE10 modern browsers
        installPostMessageImplementation();

    } else if (global.MessageChannel) {
        // For web workers, where supported
        installMessageChannelImplementation();

    } else if (doc && "onreadystatechange" in doc.createElement("script")) {
        // For IE 6–8
        installReadyStateChangeImplementation();

    } else {
        // For older browsers
        installSetTimeoutImplementation();
    }

    attachTo.setImmediate = setImmediate;
    attachTo.clearImmediate = clearImmediate;
}(typeof self === "undefined" ? typeof global === "undefined" ? this : global : self));

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(8), __webpack_require__(1)))

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

var apply = Function.prototype.apply;

// DOM APIs, for completeness

exports.setTimeout = function() {
  return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout);
};
exports.setInterval = function() {
  return new Timeout(apply.call(setInterval, window, arguments), clearInterval);
};
exports.clearTimeout =
exports.clearInterval = function(timeout) {
  if (timeout) {
    timeout.close();
  }
};

function Timeout(id, clearFn) {
  this._id = id;
  this._clearFn = clearFn;
}
Timeout.prototype.unref = Timeout.prototype.ref = function() {};
Timeout.prototype.close = function() {
  this._clearFn.call(window, this._id);
};

// Does not start the time, just sets up the members needed.
exports.enroll = function(item, msecs) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = msecs;
};

exports.unenroll = function(item) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = -1;
};

exports._unrefActive = exports.active = function(item) {
  clearTimeout(item._idleTimeoutId);

  var msecs = item._idleTimeout;
  if (msecs >= 0) {
    item._idleTimeoutId = setTimeout(function onTimeout() {
      if (item._onTimeout)
        item._onTimeout();
    }, msecs);
  }
};

// setimmediate attaches itself to the global object
__webpack_require__(6);
exports.setImmediate = setImmediate;
exports.clearImmediate = clearImmediate;


/***/ }),
/* 8 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = function (Bluebird) {
    __webpack_require__(2)(Bluebird);
     class AggregateError extends Bluebird.OperationalError {
         constructor(message) {
             super(message);
             this.length = 0;
        }
        _add(err) {
            this[this.length++] = err;
        }
        forEach(fn) {
            for(var i = 0; i < this.length; i++) {
                fn(this[i], i, this);
            }
        }
    };
    Bluebird.AggregateError = AggregateError;
};

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = function (Bluebird) {
    __webpack_require__(2)(Bluebird);
    class TimeoutError extends Bluebird.OperationalError {
        constructor(message) {
            super(message || "timeout error");
        }

    };
    Bluebird.TimeoutError = TimeoutError;
};


/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = (Bluebird) => {
    Bluebird.any = (prom, n) => Bluebird.resolve(prom).any();
    Bluebird.prototype.any = async function() {
        // const items = await this;
        // if(items.length === 0) { throw new TypeError("0 promises passed to any")}
        return this.some(1).get(0); 
    }
};

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

const escapePromiseCatch = __webpack_require__(3);
module.exports = (Bluebird) => {
    Bluebird.prototype.nodeify = // back compat alias
    Bluebird.prototype.asCallback = function asCallback(cb, opts) {
        const spread = opts && opts.spread;
        this.catch(() => {}); // opt out of unhandledRejection detection
        this.then(v => escapePromiseCatch (() => {
            if(spread) cb(null, ...v);
            else cb(null, v);
        }), e => escapePromiseCatch(() => cb(e)) );
    };
};

/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = (Bluebird) => {
    Bluebird.prototype.call = function call(methodName) {
        const passedArgs = Array.prototype.slice.call(arguments, 1);
        return Bluebird.resolve((async () => {
            const obj = await this;
            if (obj && obj[methodName]) 
                return obj[methodName].call(obj, ...passedArgs)
            
            throw new Error(`Method ${methodName} doesn't exist on obj ${JSON.stringify(obj)}` );
        })());
    };
    
    Bluebird.call = (o, ...args) => Bluebird.resolve(o).call(...args);
};


/***/ }),
/* 14 */
/***/ (function(module, exports) {

module.exports = (Bluebird) => {
    Bluebird.cast = Promise.resolve;
};

/***/ }),
/* 15 */
/***/ (function(module, exports) {

module.exports = (Bluebird) => {
    // think: super.catch
    const super_catch = Promise.prototype.catch;

    Bluebird.prototype.catch = Bluebird.prototype.caught = function catchFn(fn) {
        if (arguments.length > 1) {
            const filters = Array.prototype.slice.call(arguments, 0, -1);
            fn = arguments[arguments.length - 1];

            return super_catch.call(this, filterCatch(filters, fn));
        }
        else {
            return super_catch.call(this, fn);
        }
    };

    function filterCatch(filters, fn) {
        return (error) => {
            for (const filter of filters) {
                if (testFilter(filter, error)) {
                    return fn(error); //TODO: deal with Bluebird.bind() here?
                }
            }

            return Bluebird.reject(error);
        };
    }
};

const FILTER_CONFIGS = [
    { // Error contructor
        filterTest: (t, error) => t && (t === Error || t.prototype instanceof Error),
        predicate: (t, error) => error instanceof t
    },
    { // function
        filterTest: (t, error) => typeof t === 'function',
        predicate: (fn, error) => fn(error)
    },
    { // else: Object shallow compare w/
        // note: we test the thrown error, not the filter argument as in previous filterTest()s. This is what bluebird does.
        filterTest: (o, error) => typeof error === 'function' || (typeof error === 'object' && error !== null),
        // To match Bluebird's behavior, uses ==, not === intentionally
        predicate: (filter, error) => !Object.keys(filter).some(key => filter[key] != error[key])
    }
];

function testFilter(filterArgument, error) {
    // get the right predicate function for the type of filter the user supplied.
    const filterConfig = FILTER_CONFIGS.find(filterConfig => 
        filterConfig.filterTest(filterArgument, error));
    const { predicate } = filterConfig || {};

    // If not filters are valid, we jist return false. It's not an exception
    return predicate && predicate(filterArgument, error);
}

/***/ }),
/* 16 */
/***/ (function(module, exports) {

module.exports = (Bluebird) => {
    Bluebird.prototype.catchReturn = function catchReturn (value) {
        const filters = Array.prototype.slice.call(arguments, 0, -1);
        
        return this.catch.apply(this, [ ...filters, () => value ]);
    }
};

/***/ }),
/* 17 */
/***/ (function(module, exports) {

module.exports = (Bluebird) => {
    Bluebird.prototype.catchThrow = function catchThrow(value) {
        const filters = Array.prototype.slice.call(arguments, 0, -1);
        
        return this.catch.apply(this, [ ...filters, () => { throw value; } ]);
    }
};

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

const util = __webpack_require__(0);

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
                allYieldHandlers = [ yieldHandler, ...yieldHandlers];
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

/***/ }),
/* 19 */
/***/ (function(module, exports) {

module.exports = (Bluebird) => {
    Bluebird.defer = function defer() {
        let resolve, reject, 
            promise = new Bluebird((res, rej) => [resolve, reject] = [res, rej]);
        return { promise, resolve, reject}
    };
}


/***/ }),
/* 20 */
/***/ (function(module, exports) {

module.exports = (Bluebird) => {
    Bluebird.prototype.delay = function delay(ms) {
        return this.then(obj => new Bluebird((onFulfilled) => setTimeout(() => onFulfilled(obj), ms)));
    }
    Bluebird.delay = (ms, o) => Bluebird.resolve(o).delay(ms);
}


/***/ }),
/* 21 */
/***/ (function(module, exports) {

module.exports = (Bluebird) => {
    Bluebird.prototype.disposer = function disposer(fn) {
        return {
            _use: this,
            _cleanup: fn,
            then() { 
                throw new Error("A disposer is not a promise. Use it with `Promise.using`.")
            }
        };
    };
};


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

const schedule = __webpack_require__(3);
module.exports = (Bluebird) => {
    Bluebird.prototype.done = function() {
        this.catch(e => schedule(() => { throw e; }) );
    };
};

/***/ }),
/* 23 */
/***/ (function(module, exports) {

module.exports = (Bluebird) => {
    Bluebird.prototype.each = function each(iterator) {
      return Bluebird.resolve((async () => { 
        const promises = await Promise.all(await this);
        const length = promises.length;
        
        for(let index = 0; index <= promises.length-1; index++){
          const value = await iterator(await promises[index], index, length);
        };
        return promises;
      })());
    };

    Bluebird.each = (promise, iterator) => Bluebird.resolve(promise).each(iterator);
};

/***/ }),
/* 24 */
/***/ (function(module, exports) {

module.exports = (Bluebird) => {
    Bluebird.prototype.error = function error(handler) {
        return this.catch(isOperationalError, handler);
    };
    function isOperationalError(e) {
        if (e == null) return false;
        return (e instanceof Bluebird.OperationalError) || (e.isOperational === true);
    }
};


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

const util = __webpack_require__(0);
module.exports = (Bluebird) => {
    Bluebird.filter = (x, predicate, opts) => Bluebird.resolve(x).filter(predicate, opts);
    Bluebird.prototype.filter = async function(predicate, {concurrency} = {}) {
        const values = await this.all();
        const predicateResults = await this.map(predicate, {concurrency});
        const output = [];
        for(let i = 0; i < predicateResults.length; i++) {
            if(!predicateResults[i]) continue;
            output.push(values[i]);
        }
        return output;
    };
};



/***/ }),
/* 26 */
/***/ (function(module, exports) {

module.exports = (Bluebird) => {
    Bluebird.prototype.finally = Bluebird.prototype.lastly = function(onResolved) { 
        return Bluebird.resolve((async () => {
            try {
                var res = await this;
            } catch (e) {
                await onResolved();
                throw e;
            }
            await onResolved();
            return res;
        })());
    };
};

/***/ }),
/* 27 */
/***/ (function(module, exports) {

function indexedGetter(obj, index) {
    if (index < 0) index = Math.max(0, index + obj.length);
    return obj[index];
}

module.exports = (Bluebird) => {
    Bluebird.prototype.get = function get(prop) {
        return Bluebird.resolve((async () => {
            const value = await this;
		    const isIndex = (typeof prop === "number");
            if (!isIndex) {
                return value[prop]
            } else {
                return indexedGetter(value, prop)
            }
        })());
    };

    Bluebird.get = (promise, prop) => Bluebird.resolve(promise).get(prop);
};


/***/ }),
/* 28 */
/***/ (function(module, exports) {

module.exports = (Bluebird) => {
    Bluebird.join = async function join(...args) {
        const last = args.slice(-1)[0];

        if (typeof last === "function") {
            const otherArgs = args.slice(0, -1);
            let values = await Bluebird.all(otherArgs);
            return await last(...values);
        }
        else {
            return await Bluebird.all(args);
        }
    };
};

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

const util = __webpack_require__(0);
module.exports = (Bluebird) => {
    Bluebird.map = (x, mapper, opts) => Bluebird.resolve(x).map(mapper, opts);

    Bluebird.prototype.map = async function(mapper, {concurrency} = {}) {
        const values = await Promise.all(await this);
        if(!concurrency) {
            return await Promise.all(values.map(mapper));
        }
        const throttled = util.throttle(mapper, Number(concurrency));
        return await Promise.all(values.map(throttled));
    };
};



/***/ }),
/* 30 */
/***/ (function(module, exports) {

module.exports = (Bluebird) => {
    Bluebird.prototype.mapSeries = function each(iterator) {
      return Bluebird.resolve((async () => { 
        const promises = await this;
        const length = promises.length;
        let ret = Array(length);
        
        for(let index = 0; index <= promises.length-1; index++){
          const value = await iterator(await promises[index], index, length);
          ret = ret.concat(value);
        };
        
        return ret;
      })());
    };

    Bluebird.mapSeries = (promise, iterator) => Bluebird.resolve(promise).mapSeries(iterator);
};

/***/ }),
/* 31 */
/***/ (function(module, exports) {

module.exports = (Bluebird) => {

    Bluebird.method = function(fn) {
        if(typeof fn !== "function") {
            throw new TypeError("Non function passed to .method");
        }
        return async function() { 
            return fn.apply(this, arguments);
        }; 
    };
};

/***/ }),
/* 32 */
/***/ (function(module, exports) {

module.exports = (Bluebird) => {
    Bluebird.noConflict = () => {
        console.error("Please do not call noConflict with bluebird-api, simply do not import it!");
        console.error("See getNewLibraryCopy for copying bluebird");
    };
};

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process) {module.exports = (Bluebird) => {
    Bluebird.onPossiblyUnhandledRejection = fn => {
        if(typeof process !== "undefined" && typeof process.on === "function") {
            process.on("unhandledRejection", (e, p) => {
                if(p instanceof Bluebird) {
                    fn(e, p);
                } else {
                    if(process.listenerCount("unhandledRejection") > 1) {
                        // existing listener
                        return false;
                    } else {
                        throw e; // default to throwing per Node's policy
                    }
                }
            });
        } else if (typeof window !== "undefined" && 
                   typeof window.addEventListener === "function") {
            window.addEventListener("unhandledrejection", e => {
                if(p instanceof Bluebird) {
                    fn(event.reason, event.promise);
                } 
                // default to throwing, this is the best we can do since we don't 
                // want to throw on other unrelated promises.
            });
        } else {
            throw new Error("Could not set unhandled rejection handler in this environment \
                            because native handlers do not exist.");
        }
    };
    Bluebird.onUnhandledRejectionHandled = () => {
        throw new Error("No one ever uses this API, if you do - let us know and I'll port it")
    };
}
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const util = __webpack_require__(0);
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


/***/ }),
/* 35 */
/***/ (function(module, exports) {

module.exports = (Bluebird) => {
 Bluebird.prototype.props = function props() {
        return Bluebird.resolve((async () => {
            const ret = {}, value = await this;
            if(typeof value !== "object" || value == null) {
                throw new TypeError("Expected an object passed to `.props`, got " + typeof value + " instead");
            }
            for(const key of Object.keys(value)) {
                ret[key] = await value[key];
            }
            return ret;
        })());
    };
    Bluebird.props = o => Bluebird.resolve(o).props();
};

/***/ }),
/* 36 */
/***/ (function(module, exports) {

module.exports = (Bluebird) => {
    Bluebird.prototype.reduce = function reduce(reducer, initialValue) {
      return Bluebird.resolve((async () => { 
        const promises = await this;
        const length = promises.length;
        if (length === 0) return await initialValue;
        
        let ret;
        if (initialValue == undefined){
          let first = promises.shift();
          ret = await first;
        }else{
          ret = await initialValue;
        }
        
        for(let index = 0; index <= promises.length-1; index++){
          const value = await promises[index];
          ret = await reducer(ret, value, index, length);
        };
        
        return ret;
      })());
    };

    Bluebird.reduce = (promise, reducer, initialValue) => Bluebird.resolve(promise).reduce(reducer, initialValue);
};

/***/ }),
/* 37 */
/***/ (function(module, exports) {

module.exports = (Bluebird) => {
    Bluebird.prototype.reflect = async function() {
        try {
            const val = await this;
            return {
                isPending() { return false },
                reason() { throw new Error(); }, 
                value() { return val; }, 
                isFulfilled() { return true; },
                isCancelled() { return false; }, // back compat
                isRejected() { return false; }
            };
        } catch (e) {
            return {
                isPending() { return false },
                value() { throw new Error("Tried to get the value of a rejected promise"); },
                reason() { return e; }, 
                isFulfilled() { return false; },
                isCancelled() { return false; }, // back compat
                isRejected() { return true; }
            };
        }
    };
    // backwards compat Bluebird 2 method that works in Bluebird 3
    Bluebird.prototype.settle = arr => arr.map(Bluebird.resolve).map(x => x.reflect());
};

/***/ }),
/* 38 */
/***/ (function(module, exports) {

module.exports = (Bluebird) => {

    Bluebird.prototype.return =
    Bluebird.prototype.thenReturn = function thenReturn(any) {
        return this.then(x => any);
    };
};


/***/ }),
/* 39 */
/***/ (function(module, exports) {

module.exports = (Bluebird) => {

    // this is tricky because we need to override how `then` works.
    // note that Zalgo is by-design impossible. 
    // setScheduler will defer using the native microtask scheduler and 
    // only then delay with the provided scheduler. This makes it still work
    // for things like notifying change detection - but you can never be quicker
    // than the built in scheduler. 
    
    // it is important that we get a reference to then before it might be externally
    // modified
    const originalThen = Symbol();
    Bluebird.prototype[originalThen] = Bluebird.prototype.then; 
        Bluebird.setScheduler = function(scheduler) {
        if(typeof scheduler !== "function") {
            throw new TypeError("Passed non function to setScheduler");
        }
        Bluebird.prototype.then = function then(onFulfill, onReject) {
            return this[originalThen](
                v => new Promise(scheduler),
                e => new Promise((_, r) => scheduler(r))
            )[originalThen](onFulfill, onReject);
        };
    };
    // hook for tests
    Bluebird.setScheduler.disable = () => 
        Bluebird.prototype.then = Bluebird.prototype[originalThen];
};

/***/ }),
/* 40 */
/***/ (function(module, exports) {

module.exports = (Bluebird) => {
    Bluebird.some = (prom, n) => Bluebird.resolve(prom).some(n);
    Bluebird.prototype.some = function(n) {
        return Bluebird.resolve((async () => {
            let count = 0;
            const promises = await this;
            if(promises.length === 0) {
                throw new TypeError("Not enough promises passed to call waiting for some promises")
            }
            const results = Array(n);
            let currentResult = 0;
            const err = new Bluebird.AggregateError("Not enough promises resolved in some");
            return new Bluebird((resolve, reject) => {
                for(const promise of promises) {
                    promise.then(v => {
                        //console.log("resolved");
                        count++;
                        results[currentResult++] = v;
                        if(count >= n) {
                            resolve(results);
                        }       
                    }, e => {
                        err._add(e);
                        //console.log("rejected", e, err.length, promises.length, n);
                        if(err.length > promises.length - n) {
                            reject(err);
                        }
                    });
                }
            })
            
        })());
    };
};

/***/ }),
/* 41 */
/***/ (function(module, exports) {

module.exports = (Bluebird) => {
    Bluebird.prototype.spread = function spread(fn) {
        return this.all().then(results => fn(...results));
    };
}

/***/ }),
/* 42 */
/***/ (function(module, exports) {

module.exports = (Bluebird) => {
    // no cancellation means simple implementation here
    Bluebird.prototype.suppressUnhandledRejections = function() {
        this.catch(() => {});
        return this;
    };
};

/***/ }),
/* 43 */
/***/ (function(module, exports) {

module.exports = (Bluebird) => {
    Bluebird.prototype.tap = function tap(onFullfiled) {
        return Bluebird.resolve((async () => {
            const value = await this;
            await onFullfiled(value);
            return value;
        })());
    };

    Bluebird.tap = function tap(promise, onFullfiled) {
        return Bluebird.resolve((async () => {
            const value = await promise;
            await onFullfiled(value);
            return value;
        })());
    };
};

/***/ }),
/* 44 */
/***/ (function(module, exports) {

module.exports = (Bluebird) => {
    Bluebird.prototype.tapCatch = function(onResolved) {
        return tapCatch.call(this, ...arguments)
    };

    Bluebird.tapCatch = function(promise, onResolved) {
        return tapCatch.call(promise, ...arguments)
    };
};

function tapCatch(onResolved) {
    if (arguments.length > 1) {
        const filters = Array.prototype.slice.call(arguments, 0, -1);
        onResolved = arguments[arguments.length - 1];
        return this.catch(...filters, tapCatchCallback(onResolved));
    }
    return this.catch(tapCatchCallback(onResolved));
};

const tapCatchCallback = (onResolved) =>
    async err => {
        await onResolved(err);
        throw err;
    }

/***/ }),
/* 45 */
/***/ (function(module, exports) {

module.exports = (Bluebird) => {
    Bluebird.prototype.throw = function throwing(value) {
        return this.then(() => { throw value });
    };
};

/***/ }),
/* 46 */
/***/ (function(module, exports) {

module.exports = (Bluebird) => {
    Bluebird.prototype.timeout = function (ms, rejectDesc) {

        return Bluebird.resolve((async () => {
            const PLACE_HOLDER = [];

            if (typeof rejectDesc === 'undefined') {
                rejectDesc = PLACE_HOLDER;
            }

            
            var winner = await Bluebird.race([this, Bluebird.delay(ms, rejectDesc)]);
            
            if (winner === rejectDesc) {
                if (rejectDesc instanceof Error)
                    throw rejectDesc;
                else if (winner === PLACE_HOLDER)
                    throw new Bluebird.TimeoutError();
                throw new Bluebird.TimeoutError(rejectDesc);
            }

            return winner;
        })());
    }
    Bluebird.timeout = (ms, rejectDesc, o) => Bluebird.resolve(o).delay(ms)
}


/***/ }),
/* 47 */
/***/ (function(module, exports) {

module.exports = (Bluebird) => {
    Bluebird.try = function(fn) {
        if(typeof fn !== 'function') {
            return Bluebird.reject(new TypeError("fn must be a function"));
        }
        return Bluebird.resolve().then(fn);
    };
};

/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

const unsafe = __webpack_require__(3);

module.exports = (Bluebird) => {
    Bluebird.using = function(...disposersAndFn) {
        let fn, error;
        const results = Array(disposersAndFn.length - 1);
        return new Bluebird((resolve, reject) => {

            fn = disposersAndFn.pop();
            if(typeof fn !== "function") {
                throw new TypeError("Non function passed to using");
            }
            let remaining = disposersAndFn.length;
            const rejectCount = () => {
                remaining--;
                if(remaining === 0) reject(error);
            }
            let failed = false;
            for(let i = 0; i < disposersAndFn.length; i++) {
                const disposer = disposersAndFn[i];
                const handleErr = e => {
                    failed = true;
                    // one failed, clean up all the others.            
                    unsafe(async () => {
                        for(const item of results) {
                            if(!item) continue;
                            if(!item.disposer) continue;
                            await item.disposer._cleanup();
                        }
                        error = e;
                        rejectCount(); // reject with the error
                    });
                };
                if(disposer._use) { 
                    disposer._use.then(resource => {
                        if(failed) {
                            //todo: hold reject until these finish?
                            unsafe(async () => {
                                await disposer._cleanup(); 
                                rejectCount();
                            });
                            return;
                        }
                        results[i] = {resource, disposer};
                        if(--remaining === 0) {
                            resolve(results.map(x => x.resource));
                        }
                    }, handleErr);
                } else if (disposer.then) {
                    Bluebird.resolve(disposer).then(resource => {
                        results[i] = {resource};
                        if(--remaining === 0) {
                            resolve(results.map(x => x.resource));
                        }
                    }, handleErr);
                }
            }
        })
        .then(res => fn(...res)) // run the actual function the user passed
        .finally(v => new Bluebird((resolve) => {
            // clean up and wait for it
            unsafe(async () => {
                for(const disposer of results) {
                    if(!disposer) continue; // guard against edge case
                    if(!disposer.disposer) continue; // promise and not disposer
                    await disposer.disposer._cleanup();
                }
                resolve();
            });
        }));
    };
    // Bluebird.prototype.disposer = function disposer(fn) {
    //     return {
    //         _use: this,
    //         _cleanup: fn,
    //         then() { 
    //             throw new Error("A disposer is not a promise. Use it with `Promise.using`.")
    //         }
    //     };
    // };
};

/***/ })
/******/ ]);