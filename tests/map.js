const assert = require("assert");
const Promise = require("../promise.js");

describe("map", () => {
    it("maps sync stuff", async () => {
        var arr = await Promise.map([1,2,3], x => x + 1);
        assert.deepEqual(arr, [2,3,4]);
    });

    it("maps async stuff", async () => {
        var arr = await Promise.map([1,2,3], async x => x + 1);
        assert.deepEqual(arr, [2,3,4]);
    });

    it("maps async stuff with promise input", async () => {
        var arr = await Promise.map([1,2, Promise.resolve(3)], async x => x + 1);
        assert.deepEqual(arr, [2,3,4]);
    });

    it("maps async stuff with multiple promise input", async () => {
        var arr = await Promise.map([1,Promise.resolve(2), Promise.resolve(3)], async x => x + 1);
        assert.deepEqual(arr, [2,3,4]);
    });

    it("maps stuff that's sometimes async", async () => {
        var arr = await Promise.map([1,2, Promise.resolve(3)], (x, i) => {
            if(i%2) return Promise.resolve(x+1);
            return x + 1;
        });
        assert.deepEqual(arr, [2,3,4]);
    });
});

const specify = it;

describe("bluebird's tests for map", () => {
    
    function mapper(val) {
        return val * 2;
    }

    async function deferredMapper(val) {
        await new Promise(r => setTimeout(r, 5));
        return mapper(val);
    }

    specify("should map input values array", function() {
        var input = [1, 2, 3];
        return Promise.map(input, mapper).then(
            function(results) {
                assert.deepEqual(results, [2,4,6]);
            },
            assert.fail
        );
    });

    specify("should map input promises array", function() {
        var input = [Promise.resolve(1), Promise.resolve(2), Promise.resolve(3)];
        return Promise.map(input, mapper).then(
            function(results) {
                assert.deepEqual(results, [2,4,6]);
            },
            assert.fail
        );
    });

    specify("should map mixed input array", function() {
        var input = [1, Promise.resolve(2), 3];
        return Promise.map(input, mapper).then(
            function(results) {
                assert.deepEqual(results, [2,4,6]);
            },
            assert.fail
        );
    });

    specify("should map input when mapper returns a promise", function() {
        var input = [1,2,3];
        return Promise.map(input, deferredMapper).then(
            function(results) {
                assert.deepEqual(results, [2,4,6]);
            },
            assert.fail
        );
    });

    specify("should accept a promise for an array", function() {
        return Promise.map(Promise.resolve([1, Promise.resolve(2), 3]), mapper).then(
            function(result) {
                assert.deepEqual(result, [2,4,6]);
            },
            assert.fail
        );
    });
});