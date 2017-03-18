"use strict";

const assert = require("assert");
const Promise = require("../promise.js");

describe("setScheduler", () => {
    it("sets the scheduler in a simple case", async () => {
        let x = false;
        Promise.setScheduler(fn => {
            x = true;
            setTimeout(fn)
        });
        await Promise.resolve().then(() => {});
        assert(x);
    });
    it("does not override the global scheduler", async () => {
        let x = false;
        Promise.setScheduler(fn => {
            x = true;
            setTimeout(fn)
        });
        await Promise.resolve();
        assert(!x);
    });
    it("never sets a synchronous scheduler", () => {
        let x = false;
        Promise.setScheduler(fn => fn());
        Promise.resolve().then(() => x = true);
        assert(!x);
    });
    it("is possible to set a scheduler twice", async () => {
        let x = 0;
        let y = 0;
        Promise.setScheduler(fn => {
            x++;
            setTimeout(fn)
        });
        await Promise.resolve().then(() => {});
        assert.equal(x, 1);
        Promise.setScheduler(fn => {
            y++;
            setTimeout(fn)
        });
        await Promise.resolve().then(() => {});
        assert.equal(x, 1);
        assert.equal(y, 1);
    });
    it("calls the scheduler twice in chained calls", async () => {
        let x = 0;
        Promise.setScheduler(fn => {
            x++;
            setTimeout(fn)
        });
        await Promise.resolve().then(() => {}).then(() => {})
        assert.equal(x, 2);
    });
    after(() => Promise.setScheduler.disable());
});

describe("bluebird schedule tests", () => {
    it("should throw for non function", function() {
        try {
            Promise.setScheduler({});
        } catch (e) {
            return;
        }
        assert.fail();
    });
    after(() => Promise.setScheduler.disable());
})