const assert = require("assert");
const Promise = require("../promise.js");

describe("props", () => {

    it("reads the props of a simple object ", async () => {
        const o = {x:3, y: 5};
        const o2 = await Promise.resolve(o).props();
        assert.equal(o2.x, 3);
        assert.equal(o2.y, 5);
    });

    it("reads the props of an object where one is awaitable", async () => {
        const o = {x:3, y: Promise.resolve(5)};
        const o2 = await Promise.resolve(o).props();
        assert.equal(o2.x, 3);
        assert.equal(o2.y, 5);
    });

    it("reads the props of an object where all are awaitable", async () => {
        const o = {x: Promise.resolve(3), y: Promise.resolve(5)};
        const o2 = await Promise.resolve(o).props();
        assert.equal(o2.x, 3);
        assert.equal(o2.y, 5);
    });
    
    it("rejects when one of the props rejects", async () => {
        const o = {x: Promise.reject(new Error("Hello")), y: Promise.resolve(5)};
        try {
            const o2 = await Promise.resolve(o).props();
            assert.fail();  
        } catch (e) {
            assert(e.message === "Hello");
        }
    });
});

const specify = it;
describe("props bluebird original tests", () => {
    specify("should reject undefined", async function() {
        try {
            await Promise.props();
            assert.fail();
        } catch (e) {};
    });

    specify("should reject primitive", async function() {
        try {
            await Promise.props("str");
            assert.fail();
        } catch (e) {};

    });

    specify("should resolve to new object", function() {
        var o = {};
        return Promise.props(o).then(function(v){
            assert(v !== o);
            assert.deepEqual(o, v);
        });
    });

    specify("should resolve value properties", function() {
        var o = {
            one: 1,
            two: 2,
            three: 3
        };
        return Promise.props(o).then(function(v){
            assert.deepEqual({
                one: 1,
                two: 2,
                three: 3
            }, v);
        });
    });

    specify("should resolve immediate properties", function() {
        var o = {
            one: Promise.resolve(1),
            two: Promise.resolve(2),
            three: Promise.resolve(3)
        };
        return Promise.props(o).then(function(v){
            assert.deepEqual({
                one: 1,
                two: 2,
                three: 3
            }, v);
        });
    });

    // specify("should resolve eventual properties", function() {
    //     var d1 = Promise.defer(),
    //         d2 = Promise.defer(),
    //         d3 = Promise.defer();
    //     var o = {
    //         one: d1.promise,
    //         two: d2.promise,
    //         three: d3.promise
    //     };

    //     setTimeout(function(){
    //         d1.fulfill(1);
    //         d2.fulfill(2);
    //         d3.fulfill(3);
    //     }, 1);

    //     return Promise.props(o).then(function(v){
    //         assert.deepEqual({
    //             one: 1,
    //             two: 2,
    //             three: 3
    //         }, v);
    //     });


    // });

    // specify("should reject if any input promise rejects", function() {
    //     var o = {
    //         one: Promise.resolve(1),
    //         two: Promise.reject(2),
    //         three: Promise.resolve(3)
    //     };
    //     return Promise.props(o).then(assert.fail, function(v){
    //         assert(v === 2);
    //     });
    // });

    // specify("should accept a promise for an object", function() {
    //      var o = {
    //         one: Promise.resolve(1),
    //         two: Promise.resolve(2),
    //         three: Promise.resolve(3)
    //     };
    //     var d1 = Promise.defer();
    //     setTimeout(function(){
    //         d1.fulfill(o);
    //     }, 1);
    //     return Promise.props(d1.promise).then(function(v){
    //         assert.deepEqual({
    //             one: 1,
    //             two: 2,
    //             three: 3
    //         }, v);
    //     });

    // });

    // specify("should reject a promise for a primitive", function() {
    //     var d1 = Promise.defer();
    //     setTimeout(function(){
    //         d1.fulfill("text");
    //     }, 1);
    //     return Promise.props(d1.promise).caught(TypeError, function(){
    //     });

    // });

    // specify("should accept thenables in properties", function() {
    //     var t1 = {then: function(cb){cb(1);}};
    //     var t2 = {then: function(cb){cb(2);}};
    //     var t3 = {then: function(cb){cb(3);}};
    //     var o = {
    //         one: t1,
    //         two: t2,
    //         three: t3
    //     };
    //     return Promise.props(o).then(function(v){
    //         assert.deepEqual({
    //             one: 1,
    //             two: 2,
    //             three: 3
    //         }, v);
    //     });
    // });

    // specify("should accept a thenable for thenables in properties", function() {
    //     var o = {
    //       then: function (f) {
    //         f({
    //           one: {
    //             then: function (cb) {
    //               cb(1);
    //             }
    //           },
    //           two: {
    //             then: function (cb) {
    //               cb(2);
    //             }
    //           },
    //           three: {
    //             then: function (cb) {
    //               cb(3);
    //             }
    //           }
    //         });
    //       }
    //     };
    //     return Promise.props(o).then(function(v){
    //         assert.deepEqual({
    //             one: 1,
    //             two: 2,
    //             three: 3
    //         }, v);
    //     });
    // });

    // specify("treats arrays for their properties", function() {
    //     var o = [1,2,3];

    //     return Promise.props(o).then(function(v){
    //         assert.deepEqual({
    //             0: 1,
    //             1: 2,
    //             2: 3
    //         }, v);
    //     });
    // });

    // specify("works with es6 maps", function() {
    //         return Promise.props(new Map([
    //             ["a", Promise.resolve(1)],
    //             ["b", Promise.resolve(2)],
    //             ["c", Promise.resolve(3)]
    //         ])).then(function(result) {
    //             assert.strictEqual(result.get("a"), 1);
    //             assert.strictEqual(result.get("b"), 2);
    //             assert.strictEqual(result.get("c"), 3);
    //         });
    //     });

    // specify("doesn't await promise keys in es6 maps", function() {
    //     var a = new Promise(function() {});
    //     var b = new Promise(function() {});
    //     var c = new Promise(function() {});

    //     return Promise.props(new Map([
    //         [a, Promise.resolve(1)],
    //         [b, Promise.resolve(2)],
    //         [c, Promise.resolve(3)]
    //     ])).then(function(result) {
    //         assert.strictEqual(result.get(a), 1);
    //         assert.strictEqual(result.get(b), 2);
    //         assert.strictEqual(result.get(c), 3);
    //     });
    // });

    // specify("empty map should resolve to empty map", function() {
    //     return Promise.props(new Map()).then(function(result) {
    //         assert(result instanceof Map);
    //     });
    // });

});