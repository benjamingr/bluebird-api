const assert = require("assert");
const Promise = require("../promise.js");

describe("some", () => {
    it("rejects no promises passed", async () => {
        try {
            await Promise.some([], 1);
            assert.fail();
        } catch(e) {
            assert(e instanceof Promise.TypeError);
        }
     });
    it("rejects one rejected promise passed", async () => {
        try {
            await Promise.some([Promise.reject(2)], 1);
            assert.fail();
        } catch(errs) {
            errs.forEach(e => assert.equal(e, 2))
        }
    });
    
    it("rejects two rejected promises passed", async () => {
        try {
            await Promise.some([Promise.reject(0), Promise.reject(1)], 1);
            assert.fail();
        } catch(errs) {
            errs.forEach((e, i) => assert.equal(e, i))
        }
    });

    
    it("resolves with two rejections and a resolve", async () => {
        const [v] = await Promise.some([
            Promise.reject(0), 
            Promise.reject(1),
            Promise.resolve(2)
        ], 1);
        assert.equal(v, 2);    
    });

    
    it("resolves with two rejections and a resolve ordered", async () => {
        const [v] = await Promise.some([
            Promise.resolve(2),
            Promise.reject(0), 
            Promise.reject(1),
        ], 1);
        assert.equal(v, 2);    
    });

    it("resolves with async resolution", async () => {
        const [v] = await Promise.some([
            new Promise(r => setTimeout(() => r(2), 5)),
            Promise.reject(0), 
            Promise.reject(1),
        ], 1);
        assert.equal(v, 2);
    });

    it("resolves with two items", async () => {
        const [one, oneToo] = await Promise.some([
            Promise.resolve(1),
            Promise.resolve(1)
        ], 2);
        assert.equal(one, 1);
        assert.equal(oneToo, 1);
    });
    it("resolves in order", async () => {
        const [one, two] = await Promise.some([
            new Promise(r => setTimeout(() => r(2), 5)),
            Promise.resolve(1)
        ], 2);
        assert.equal(one, 1);
        assert.equal(two, 2);
    });
    
    it("rejects as soon as the goal cannot be reached", async () => {
        try {
            await Promise.some([
                Promise.reject(0),
                Promise.reject(1),
                new Promise(() => {})
            ], 2);
            assert.fail();
        } catch(errs) {
            errs.forEach((e, i) => assert.equal(e, i))
        }
    });
});