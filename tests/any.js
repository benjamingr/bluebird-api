const assert = require("assert");
const Promise = require("../promise.js");

describe("any", () => {
    it("rejects no promises passed", async () => {
        try {
            await Promise.any([]);
            assert.fail();
        } catch(e) {
            assert(e instanceof Promise.TypeError);
        }
     });
    it("rejects one rejected promise passed", async () => {
        try {
            await Promise.any([Promise.reject(2)]);
            assert.fail();
        } catch(errs) {
            errs.forEach(e => assert.equal(e, 2))
        }
    });
    
    it("rejects two rejected promises passed", async () => {
        try {
            await Promise.any([Promise.reject(0), Promise.reject(1)]);
            assert.fail();
        } catch(errs) {
            errs.forEach((e, i) => assert.equal(e, i))
        }
    });

    
    it("resolves with two rejections and a resolve", async () => {
        const v = await Promise.any([
            Promise.reject(0), 
            Promise.reject(1),
            Promise.resolve(2)
        ]);
        assert.equal(v, 2);    
    });
    
    it("resolves with two rejections and a resolve ordered", async () => {
        const v = await Promise.any([
            Promise.resolve(2),
            Promise.reject(0), 
            Promise.reject(1),
        ]);
        assert.equal(v, 2);    
    });

    it("resolves with async resolution", async () => {
        const v = await Promise.any([
            new Promise(r => setTimeout(() => r(2), 5)),
            Promise.reject(0), 
            Promise.reject(1),
        ]);
        assert.equal(v, 2);
    });

    it('any should return bluebird promise', () => {
        const v = Promise.any([
            Promise.reject(0), 
            Promise.reject(1),
            Promise.resolve(2)
        ]);
        assert.ok(v instanceof Promise)
    })
});