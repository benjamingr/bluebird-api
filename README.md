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
#### [.spread](http://bluebirdjs.com/docs/api/spread.html)
Like calling .then, but the fulfillment value must be an array, which is flattened to the formal parameters of the fulfillment handler.
```js
.spread([function(any values...) fulfilledHandler]) -> Promise
```
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

## License
Some tests under MIT license for Kris Kowal, Petka Antonov and Brian Cavalier
