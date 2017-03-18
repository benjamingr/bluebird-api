const assert = require("assert");
const Promise = require("../promise.js");

describe("AggregateError", () => {
    it("is on the promise object", () => {
        assert(Promise.AggregateError);
    });

    it("is an error subclass", () => {
        assert(new Promise.AggregateError() instanceof Error);
    });
    it("has a forEach property", () => {
        assert("forEach" in (new Promise.AggregateError));
    });
    it("has a length property", () => {
        assert("length" in (new Promise.AggregateError));
    });
    it("has a stack property", () => {
        let err;
        try {
            throw (new Promise.AggregateError);
        } catch (e) {
            err = e;
        }
        assert("stack" in err);
    });
    it("iterates errors with forEach", () => {
        const err = new Promise.AggregateError();
        err._add(new Error("hello"));
        let count = 0;
        err.forEach(e => {
            count++;
            assert.equal(e.message, "hello");
        });
        assert.equal(count, 1);
    });
})