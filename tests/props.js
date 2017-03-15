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