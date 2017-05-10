# bluebird-api

## Introduction
[Bluebird](https://github.com/petkaantonov/bluebird) compatible API on top of native promises as a drop-in replacement.

WIP - contributions welcome.

## Getting started

* bluebird-api depends on node 7.0 and above

```
$ npm install bluebird-api
```
Then :
```js
const Promise = require('bluebird-api');
```
## Contributing
1. [Fork](https://github.com/benjamingr/bluebird-api#fork-destination-box) the repository
2. ``git clone https://github.com/**your GH user**/bluebird-api``
3. ``cd bluebird-api``
4. ``npm install``
5. ``npm test``

## Why
There are [many reasons to use bluebird](http://bluebirdjs.com/docs/why-bluebird.html).
As native Promise implementations improve, bluebird-api allows keeping the same code but enjoying the benefits of improved native Promises.

## API

http://bluebirdjs.com/docs/api-reference.html

### Core

#### [Promise.then](http://bluebirdjs.com/docs/api/then.html)
```js
.then(
    [function(any value) fulfilledHandler],
    [function(any error) rejectedHandler]
) -> Promise

```

#### [Promise.catch](http://bluebirdjs.com/docs/api/catch.html)

`.catch` is a convenience method for handling errors in promise chains. It comes in two variants - A catch-all variant similar to the synchronous `catch(e) {` block. This variant is compatible with native promises. - A filtered variant (like other non-JS languages typically have) that lets you only handle specific errors. ***This variant is usually preferable and is significantly safer.***


#### [Promise.error](http://bluebirdjs.com/docs/api/error.html)

```js
.error([function(any error) rejectedHandler]) -> Promise
```

Like `.catch` but instead of catching all types of exceptions, it only catches operational errors.

Note, "errors" mean errors, as in objects that are `instanceof Error` - not strings, numbers and so on.

#### [Promise.spread](http://bluebirdjs.com/docs/api/spread.html)
Like calling .then, but the fulfillment value must be an array, which is flattened to the formal parameters of the fulfillment handler.
```js
.spread([function(any values...) fulfilledHandler]) -> Promise
```


#### [Promise.finally](http://bluebirdjs.com/docs/api/finally.html)

```js
.finally(function() handler) -> Promise
.lastly(function() handler) -> Promise
```

Pass a handler that will be called regardless of this promise's fate. Returns a new promise chained from this promise. There are special semantics for .finally in that the final value cannot be modified from the handler.

> Note: using `.finally` for resource management has better alternatives, see [resource management](http://bluebirdjs.com/docs/api/resource-management.html)

#### [Promise.join](http://bluebirdjs.com/docs/api/promise.join.html)
For coordinating multiple concurrent discrete promises. While ``.all`` is good for handling a dynamically sized list of uniform promises, ``Promise.join`` is much easier (and more performant) to use when you have a fixed amount of discrete promises that you want to coordinate concurrently. The final parameter, handler function, will be invoked with the result values of all of the fufilled promises.
```js
Promise.join(Promise<any>|any values..., function handler) -> Promise
```
#### [Promise.try](http://bluebirdjs.com/docs/api/promise.try.html)
Start the chain of promises with ``Promise.try``. Any synchronous exceptions will be turned into rejections on the returned promise.
```js
Promise.try(function() fn) -> Promise
```
#### [Promise.method](http://bluebirdjs.com/docs/api/promise.method.html)
Returns a new function that wraps the given function ``fn``. The new function will always return a promise that is fulfilled with the original functions return values or rejected with thrown exceptions from the original function.
```js
Promise.method(function(...arguments) fn) -> function
```


#### [Promise.suppressUnhandledRejections](http://bluebirdjs.com/docs/api/suppressunhandledrejections.html)

```js
.suppressUnhandledRejections() -> undefined

```

Basically sugar for doing:
```js
somePromise.catch(function(){});
```

Which is needed in case error handlers are attached asynchronously to the promise later, which would otherwise result in premature unhandled rejection reporting.


#### [Promise.onPossiblyUnhandledRejection](http://bluebirdjs.com/docs/api/promise.onpossiblyunhandledrejection.html)

```js
Promise.onPossiblyUnhandledRejection(function(any error, Promise promise) handler) -> undefined
```

> Note: this hook is specific to the bluebird instance its called on, application developers should use [global rejection events](http://bluebirdjs.com/docs/api/error-management-configuration.html#global-rejection-events)

Add `handler` as the handler to call when there is a possibly unhandled rejection. The default handler logs the error stack to stderr or `console.error` in browsers.

```js
Promise.onPossiblyUnhandledRejection(function(e, promise) {
    throw e;
});
```

Passing no value or a non-function will have the effect of removing any kind of handling for possibly unhandled rejections.



### Timers
#### [.delay](http://bluebirdjs.com/docs/api/delay.html)
Returns a promise that will be resolved with ms milliseconds.
```js
.delay(int ms) -> Promise
```
#### [.timeout](http://bluebirdjs.com/docs/api/timeout.html)
Returns a promise that will be fulfilled with this promise's fulfillment value or rejection reason. However, if this promise is not fulfilled or rejected within ms milliseconds, the returned promise is rejected with a TimeoutError or the error as the reason.
```js
.timeout(int ms, [String message="operation timed out"]) -> Promise
---
.timeout(int ms, [Error error]) -> Promise
```

### Promisification
#### [Promise.promisify](http://bluebirdjs.com/docs/api/promise.promisify.html)
Returns a function that will wrap the given ``nodeFunction``. Instead of taking a callback, the returned function will return a promise whose fate is decided by the callback behavior of the given node function. The node function should conform to node.js convention of accepting a callback as last argument and calling that callback with error as the first argument and success value on the second argument.
```js
Promise.promisify(
  function(any arguments..., function callback) nodeFunction,
  [Object { multiArgs: boolean=false, context: any=this } options]
) -> function
```

#### [Promise.asCallback](http://bluebirdjs.com/docs/api/ascallback.html)
```js
.asCallback(
    [function(any error, any value) callback],
    [Object {spread: boolean=false} options]
) -> this
```
```js
.nodeify(
    [function(any error, any value) callback],
    [Object {spread: boolean=false} options]
) -> this
```

Register a node-style callback on this promise. When this promise is either fulfilled or rejected, the node callback will be called back with the node.js convention where error reason is the first argument and success value is the second argument. The error argument will be `null` in case of success.

Returns back this promise instead of creating a new one. If the `callback` argument is not a function, this method does not do anything.



### Collections
#### [.props](http://bluebirdjs.com/docs/api/props.html)
Like ``.all`` but for object properties or ``Map``s entries instead of iterated values. Returns a promise that is fulfilled when all the properties of the object or the ``Map``'s values are fulfilled. The promise's fulfillment value is an object or a ``Map`` with fulfillment values at respective keys to the original object or a ``Map``. If any promise in the object or ``Map`` rejects, the returned promise is rejected with the rejection reason.
```js
.props(Object|Map|Promise<Object|Map> input) -> Promise
```
#### [.each](http://bluebirdjs.com/docs/api/each.html)
Iterate over an array, or a promise of an array, which contains promises (or a mix of promises and values) with the given ``iterator`` function with the signature ``(value, index, length)`` where value is the resolved ``value`` of a respective promise in the input array. Iteration happens serially. If any promise in the input array is rejected the returned promise is rejected as well.
```js
.each(function(any item, int index, int length) iterator) -> Promise
```
#### [.mapSeries](http://bluebirdjs.com/docs/api/mapseries.html)
Given an ``Iterable``(arrays are ``Iterable``), or a promise of an ``Iterable``, which produces promises (or a mix of promises and values), iterate over all the values in the ``Iterable`` into an array and iterate over the array serially, in-order.
```js
.mapSeries(function(any item, int index, int length) mapper) -> Promise
```
#### [.map](http://bluebirdjs.com/docs/api/map.html)
Given an ``Iterable``(arrays are ``Iterable``), or a promise of an ``Iterable``, which produces promises (or a mix of promises and values), iterate over all the values in the ``Iterable`` into an array and map the array to another using the given mapper function.
```js
.map(function(any item, int index, int length) mapper, [Object {concurrency: int=Infinity} options]) -> Promise
```
#### [.filter](http://bluebirdjs.com/docs/api/filter.html)
Given an ``Iterable``(arrays are ``Iterable``), or a promise of an ``Iterable``, which produces promises (or a mix of promises and values), iterate over all the values in the ``Iterable`` into an array and filter the array to another using the given filterer function.

```js
.filter(function(any item, int index, int length) filterer, [Object {concurrency: int=Infinity} options]) -> Promise
```

### [.reduce](http://bluebirdjs.com/docs/api/promise.reduce.html)

```js
Promise.reduce(
    Iterable<any>|Promise<Iterable<any>> input,
    function(any accumulator, any item, int index, int length) reducer,
    [any initialValue]
) -> Promise
```

Given an `Iterable`(arrays are `Iterable`), or a promise of an `Iterable`, which produces promises (or a mix of promises and values), iterate over all the values in the Iterable into an array and [reduce the array to a value](https://en.wikipedia.org/wiki/Fold_(higher-order_function) using the given `reducer` function.

If the reducer function returns a promise, then the result of the promise is ***awaited, before continuing with next iteration***. If any promise in the array is rejected or a promise returned by the reducer function is rejected, the result is rejected as well.


### [.some](http://bluebirdjs.com/docs/api/promise.some.html)
```js
Promise.some(
    Iterable<any>|Promise<Iterable<any>> input,
    int count
) -> Promise
```
Given an `Iterable`(arrays are `Iterable`), or a promise of an `Iterable`, which produces promises (or a mix of promises and values), iterate over all the values in the `Iterable` into an array and return a promise that is fulfilled as soon as `count` promises are fulfilled in the array. The fulfillment value is an array with count values in the order they were fulfilled.


#### [.any](http://bluebirdjs.com/docs/api/promise.any.html)

```js
Promise.any(Iterable<any>|Promise<Iterable<any>> input) -> Promise
```

Like `Promise.some`, with 1 as count. However, if the promise fulfills, the fulfillment value is not an array of 1 but the value directly.



### Utility
#### [.tap](http://bluebirdjs.com/docs/api/tap.html)
Accept a resolved value (is not called for rejections) and passes value through to the next handler.
```js
.tap(function(any value) handler) -> Promise
```
#### [.get](http://bluebirdjs.com/docs/api/get.html)
Convenience method for getting a property of a resolved object.
```js
.get(String propertyName|int index) -> Promise
```
#### [.call](http://bluebirdjs.com/docs/api/call.html)
Convenience method for calling a method of a resolved object.
```js
.call(String methodName, [any args...])
```
#### [.reflect](http://bluebirdjs.com/docs/api/reflect.html)
The ``.reflect`` method returns a promise that is always successful when this promise is settled. Its fulfillment value is an object that implements the ``PromiseInspection`` interface and reflects the resolution of this promise.
```js
.reflect() -> Promise<PromiseInspection>
```


#### [.noConflict](http://bluebirdjs.com/docs/api/promise.noconflict.html)
```js
Promise.noConflict() -> Object
```
This is relevant to browser environments with no module loader.

Release control of the `Promise` namespace to whatever it was before this library was loaded. Returns a reference to the library namespace so you can attach it to something else.


The `.reflect` method returns a promise that is always successful when this promise is settled. Its fulfillment value is an object that implements the [PromiseInspection](http://bluebirdjs.com/docs/api/promiseinspection.html) interface and reflects the resolution of this promise.


#### [.return](http://bluebirdjs.com/docs/api/return.html)

```js
.return(any value) -> Promise
.thenReturn(any value) -> Promise

```

#### Convenience method for:
```js
.then(function() {
   return value;
});
```
in the case where value ***doesn't change its value*** because its binding time is different than when using a closure.


#### [.throw](http://bluebirdjs.com/docs/api/throw.html)
```js
.throw(any reason) -> Promise
.thenThrow(any reason) -> Promise
```

#### Convenience method for:

```js
.then(function() {
   throw reason;
});
```

Same limitations regarding to the binding time of `reason` to apply as with `.return`.

For compatibility with earlier ECMAScript version, an alias `.thenThrow` is provided for `.throw`.


#### [.catchReturn](http://bluebirdjs.com/docs/api/catchreturn.html)

```js
.catchReturn(
    [class ErrorClass|function(any error) predicate],
    any value
) -> Promise
```

#### Convenience method for:

```js
.catch(function() {
   return value;
});
```

You may optionally prepend one predicate function or ErrorClass to pattern match the error (the generic `.catch` methods accepts multiple)

Same limitations regarding to the binding time of `value` to apply as with `.return`.

#### [.catchThrow](http://bluebirdjs.com/docs/api/catchthrow.html)

```js
.catchThrow(
    [class ErrorClass|function(any error) predicate],
    any reason
) -> Promise
```

#### Convenience method for:

```js
.catch(function() {
   throw reason;
});
```

You may optionally prepend one predicate function or ErrorClass to pattern match the error (the generic `.catch` methods accepts multiple)

Same limitations regarding to the binding time of `reason` to apply as with `.return`.

### [.tapCatch](http://bluebirdjs.com/docs/api/tapcatch.html)

`tapCatch` is a convenience method for reacting to errors without handling them with promises - similar to `finally` but only called on rejections. Useful for logging errors.

### Generators

#### [.coroutine](http://bluebirdjs.com/docs/api/promise.coroutine.html)

```js

Promise.coroutine(GeneratorFunction(...arguments) generatorFunction, Object options) -> function
```

Returns a function that can use `yield` to yield promises. Control is returned back to the generator when the yielded promise settles. This can lead to less verbose code when doing lots of sequential async calls with minimal processing in between. Requires node.js 0.12+, io.js 1.0+ or Google Chrome 40+.


### Deprecated

#### .cast
This API is deprecated both in bluebird and bluebird-api, and exist in bluebird-api as part of backward compatibility.

#### [.defer](http://bluebirdjs.com/docs/api/deferred-migration.html)

Deferreds are deprecated in favor of the promise constructor. If you need deferreds for some reason, you can create them trivially using the constructor:

```js
function defer() {
    var resolve, reject;
    var promise = new Promise(function() {
        resolve = arguments[0];
        reject = arguments[1];
    });
    return {
        resolve: resolve,
        reject: reject,
        promise: promise
    };
}
```




### Configuration

#### [.done](http://bluebirdjs.com/docs/api/done.html)
```js
.done(
    [function(any value) fulfilledHandler],
    [function(any error) rejectedHandler]
) -> undefined
```

Like `.then`, but any unhandled rejection that ends up here will crash the process (in node) or be thrown as an error (in browsers). The use of this method is heavily discouraged and it only exists for historical reasons.





### Resouce Management


#### [.using](http://bluebirdjs.com/docs/api/promise.using.html)

```js
Promise.using(
    Promise|Disposer|any resource,
    Promise|Disposer|any resource...,
    function(any resources...) handler
) -> Promise
```

```js
Promise.using(
    Array<Promise|Disposer|Any> resources,
    function(Array<any> resources) handler
) -> Promise
```


In conjunction with `.disposer`, `using` will make sure that no matter what, the specified disposer will be called when the promise returned by the callback passed to `using` has settled. The disposer is necessary because there is no standard interface in node for disposing resources.



#### [.disposer](http://bluebirdjs.com/docs/api/disposer.html)
```js
.disposer(function(any resource, Promise usingOutcomePromise) disposer) -> Disposer
```
A meta method used to specify the disposer method that cleans up a resource when using `Promise.using`.

Returns a Disposer object which encapsulates both the resource as well as the method to clean it up. The user can pass this object to `Promise.using` to get access to the resource when it becomes available, as well as to ensure it's automatically cleaned up.

The second argument passed to a disposer is the result promise of the using block, which you can inspect synchronously.



## License
Some tests under MIT license for Kris Kowal, Petka Antonov and Brian Cavalier
