const assert = require("assert");
const Promise = require("../promise.js");

function disposer() {
    const obj = {closed: false};
    return Promise.resolve().then(() => {
        return obj;
    }).disposer(() => {
        obj.closed = true;
    });
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
    // it("works with a single resource", async () => {
    //     const d = disposer();
    //     const [o] = await Promise.using(d, (obj) => {
    //         assert(!obj.closed);
    //         return [obj];
    //     });
    //     assert(o.closed);
    // });
    
    // it("works with a single promise", async () => {
    //     let ran = false;
    //     await Promise.using(Promise.resolve(3), (three) => {
    //         ran = true;
    //         assert.equal(three, 3);
    //     });
    //     assert(ran);
    // });
    
    // it("works with two succeeding resources", async () => {
    //     const [d, e] = [disposer(), disposer()];
    //     const [o, t] = await Promise.using(d, e, (one, two) => {
    //         assert(!one.closed);
    //         assert(!two.closed);
    //         return [one, two];
    //     });
    //     assert(o.closed);
    //     assert(t.closed);
    // });
    
    it("works with a failing resource", async () => {
        const d = rejectedDisposer(3);
        let called = false;
        const v = await (Promise.using(d, assert.fail)/*.catch(e => {
            assert.equal(e, 3);
            called = true;
        }));*/);
        console.log(v);
        console.log("Test")
        assert(called);
    });
    
    // it("works with two failing resources", async () => {
    //     const disposer = Promise.resolve
    // });
    
    // it("works with one succeeding resource and one failing resource", async () => {
    //     const disposer = Promise.resolve
    // });

    
    // it("works with one succeeding promise and one failing resource", async () => {
    //     const disposer = Promise.resolve
    // });
    
    // it("works with one succeeding resource and one failing promise", async () => {
    //     const disposer = Promise.resolve
    // });
    
    // it("works with two succeeding resources and one failing resource", async () => {
    //     const disposer = Promise.resolve
    // });
    
    // it("works with three succeeding resources", async () => {
    //     const disposer = Promise.resolve
    // });
    // it("returns a promise for continuation", async () => {

    // });
    // it("resolves that promise with the return value", async () => {

    // });
});