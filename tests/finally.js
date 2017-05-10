
const assert = require("assert");
const Promise = require("../promise.js");

describe("finally", () => {
    it("runs on fulfillment", async () => {
        let run = false;
        await Promise.resolve().finally(() => run = true);
        assert(run);
    });

    it("runs on rejection", async () => {
      let run = false;
      try {
        await Promise.reject(Error('test rejection')).finally(() => run = true);
      }
      catch (e) {
        assert(run);
      }
    });

    it("doesn't change return vlaue", async () => {
        const value = await Promise.resolve(2).finally(() => 3);
        assert.equal(value, 2);
    });
    it("runs async ", async () => {
        let sync = true;
        Promise.resolve().finally(() => sync = false);
        assert(sync);
    });
    it("overried rejections", async () => {
        let sync = true;
        try {
            await Promise.reject(2).finally(() => { throw 3});
            assert.fail();
        } catch (e) {
            assert.equal(e, 3);
        }
    });
});
