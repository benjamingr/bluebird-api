const assert = require("assert");
const Promise = require("../promise.js");

function disposer() {
    const obj = {closed: false};
    const d = Promise.resolve().then(() => {
        return obj;
    }).disposer(() => {
        obj.closed = true;
    });
    d._obj = obj;
    return d;
}
function rejectedDisposer(v) {
    const obj = {closed: false};
    return Promise.reject(v).then(() => {
        return obj;
    }).disposer(() => {
        obj.closed = true;
    });
}
describe("using", () => {
    it("works with a single resource", async () => {
        const d = disposer();
        const [o] = await Promise.using(d, (obj) => {
            assert(!obj.closed);
            return [obj];
        });
        assert(o.closed);
    });
    
    it("works with a single promise", async () => {
        let ran = false;
        await Promise.using(Promise.resolve(3), (three) => {
            ran = true;
            assert.equal(three, 3);
        });
        assert(ran);
    });
    
    it("works with two succeeding resources", async () => {
        const [d, e] = [disposer(), disposer()];
        const [o, t] = await Promise.using(d, e, (one, two) => {
            assert(!one.closed);
            assert(!two.closed);
            return [one, two];
        });
        assert(o.closed);
        assert(t.closed);
    });
    
    it("works with a failing resource", async () => {
        const d = rejectedDisposer(3);
        let called = false;
        const v = await (Promise.using(d, assert.fail).catch(e => {
            assert.equal(e, 3);
            called = true;
        }));
        assert(called);
    });
    
    
    it("works with one succeeding resource and one failing resource", async () => {
        const [d, e] = [disposer(), rejectedDisposer(3)];
        assert(!d._obj.closed);
        await Promise.using(d, e, assert.fail).catch(e => {
            assert.equal(e, 3);
        });
        assert(d._obj.closed);
    });
    
    it("works with one succeeding promise and one failing resource", async () => {
        const [d, e] = [Promise.resolve(), rejectedDisposer(3)];
        await Promise.using(d, e, assert.fail).catch(e => {
            assert.equal(e, 3);
        });
    });
    
    it("works with one succeeding resource and one failing promise", async () => {
        const [d, e] = [disposer(), Promise.reject(3)];
        assert(!d._obj.closed);
        await Promise.using(d, e, assert.fail).catch(e => {
            assert.equal(e, 3);
        });
        assert(d._obj.closed);
    });
    
    it("works with two succeeding resources and one failing resource", async () => {
        const [d, e, f] = [disposer(), rejectedDisposer(3), disposer()];
        assert(!d._obj.closed);
        assert(!f._obj.closed);
        await Promise.using(d, e, f, assert.fail).catch(e => {
            assert.equal(e, 3);
        });
        assert(d._obj.closed);
        assert(f._obj.closed);
    });
    
    it("works with three succeeding resources", async () => {
        const [d, e, f] = [disposer(), disposer(3), disposer()];
        assert(!d._obj.closed);
        assert(!f._obj.closed);
        await Promise.using(d, e, f, () => { });
        assert(d._obj.closed);
        assert(e._obj.closed);
        assert(f._obj.closed);
    });
});