const assert = require("assert");
const Promise = require("../promise.js");

describe("join", () => {
    it("joins a single value", async () => {
        let called = false;
        await Promise.join(1, (one) => {
            assert.equal(one, 1);
            called = true;
        });
        assert.equal(called, true);
    });

    it("joins two values", async () => {
        let called = false;
        await Promise.join(1, 2, (one, two) => {
            assert.equal(one, 1);
            assert.equal(two, 2);
            called = true;
        });
        assert.equal(called, true);
    });

    it("joins a single promise", async () => {
        let called = false;
        await Promise.join(Promise.resolve(1), one => {
            assert.equal(one, 1);
            called = true;
        });
        assert.equal(called, true);
    });

    it("joins two promises", async () => {
        let called = false;
        await Promise.join(Promise.resolve(1), Promise.resolve(2), (one, two) => {
            assert.equal(one, 1);
            assert.equal(two, 2);
            called = true;
        });
        assert.equal(called, true);
    });
    
    it("joins mixed value", async () => {
        let called = false;
        await Promise.join(Promise.resolve(1), 2, (one, two) => {
            assert.equal(one, 1);
            assert.equal(two, 2);
            called = true;
        });
        assert.equal(called, true);
    });
});

const specify = it;

describe("bluebird builtin tests", async () => {

    specify("should call last argument as a spread function", function() {
        return Promise.join(Promise.resolve(1), Promise.resolve(2), Promise.resolve(3), function(a, b, c) {
            assert(a === 1);
            assert(b === 2);
            assert(c === 3);
        });
    });


    specify("gh-227", function() {
        function a() {
            return Promise.join(Promise.resolve(1), function () {
                throw new Error();
            });
        }

        return a().then(assert.fail, function(e) {});
    });

    specify("should not pass the callback as argument, <5 arguments", function() {
        return Promise.join(1, 2, 3, function() {
            assert.strictEqual(arguments.length, 3);
        });
    });

    specify("should not pass the callback as argument >5 arguments", function() {
        return Promise.join(1, 2, 3, 4, 5, 6, 7, function() {
            assert.strictEqual(arguments.length, 7);
        });
    });

    specify("should ensure asynchronity", function() {
        var sync = false;
        Promise.join(Promise.resolve(1), Promise.resolve(2), function() {
            sync = true;
        });
        assert.strictEqual(false, sync);
    })

});