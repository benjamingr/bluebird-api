

const Promise = require("../promise.js");
const assert = require("assert");
const waitEnough = cb => setTimeout(cb, 5);

describe("suppressunhandledrejections", () => {
    const listener = e => assert.fail(e);

    before(() => {
        process.on("unhandledRejection", listener);
    });

    after(() => {
        process.removeListener("unhandledRejection", listener);
    });

    it("suppresses rejections", done => {
        Promise.reject().suppressUnhandledRejections();
        waitEnough(done);
    });

    it("returns a promise", () => {
        const p = Promise.reject().suppressUnhandledRejections();
        assert(p instanceof Promise);
    });
    
    it("returns the same promise", () => {
        const p = Promise.reject();
        const p2 = p.suppressUnhandledRejections();
        assert.strictEqual(p, p2);
    });

    it("suppresses rejections if multiple calls", done => {
        const p = Promise.reject();
        p.suppressUnhandledRejections();
        p.suppressUnhandledRejections();
        waitEnough(done);
    });

    it("is still able to catch the rejection", done => {
        const p = Promise.reject(2);
        let v = 1;
        p.suppressUnhandledRejections().catch(v2 => v = v2);
        waitEnough(() => {
            assert.equal(v, 2); 
            done();
        });
    });
});