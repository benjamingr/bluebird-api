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
describe("using", () => {
    it("works with a single resource", async () => {
        const d = disposer();
        const o = await Promise.using(d, obj => {
            assert(!obj.closed);
            return obj;
        });
        console.log("GOT HERE", o);
        assert(o.closed);
    });
    
    // it("works with a single promise", async () => {
    //     const disposer = Promise.resolve(500).disposer()
    // });
    
    // it("works with two succeeding resources", async () => {
    //     const disposer = Promise.resolve
    // });
    
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