const assert = require("assert");
const Promise = require("../promise.js");

describe("map", () => {
    it("maps sync stuff", async () => {
        var arr = await Promise.map([1,2,3], x => x + 1);
        assert.deepEqual(arr, [2,3,4]);
    });
});