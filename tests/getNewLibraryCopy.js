const assert = require("assert");
const Bluebird = require("../promise.js");
describe("getNewLibraryCopy", () => {
    it("is a different library instance", () => {
        const b = Bluebird.getNewLibraryCopy();
        assert.notEqual(b, Bluebird);
        console.log((new b(() => {})).__proto__)
        assert((new b(() => {})) instanceof Promise);
        assert(!(b instanceof Bluebird));
    });
    // it("called twice, gets you two different library instances", () => {
    //     const b = Bluebird.getNewLibraryCopy();
    //     const c = Bluebird.getNewLibraryCopy();
    //     assert.notEqual(b, c);
    //     assert.notEqual(b, Bluebird);
    //     assert(b instanceof Promise);
    //     assert(c instanceof Promise);
    // });
    // it("does not copy new properties if forked from one with more properties", () => {
    //     const b = Bluebird.getNewLibraryCopy();
    //     b.foo = 15;
    //     const c = c.getNewLibraryCopy();
    //     assert.notEqual(c.foo, 15);
    //     assert(!("foo" in c));
    // });
});