const assert = require("assert");
const Promise = require("../promise.js");

describe("tap", () => {
    it("taps a promise", async function() {
        const p = Promise.resolve("hello");
        let val = "";
        const returnValue = await p.tap(inner => val = inner + " world");
        assert.equal(val, "hello world");
        assert.equal(returnValue, "hello");
    });
});