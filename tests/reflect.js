const assert = require("assert");
const Promise = require("../promise.js");

describe("reflect", () => {
    it("does not reject on fullfillment", async () => {
        await Promise.resolve().reflect();
    });
    it("does not reject on rejection", async () => {
        await Promise.reject().reflect();
    });
    it("has a value on fullfillment", async () => {
        const obj = await Promise.resolve("Zirak loves jQuery").reflect();
        const value = obj.value();
        assert.equal(value, "Zirak loves jQuery");
    });
    it("is fulfilled on fullfillment", async () => {
        const obj = await Promise.resolve("Zirak loves jQuery").reflect();
        assert(obj.isFulfilled());
        const value = obj.value();
        assert.equal(value, "Zirak loves jQuery");
    });
    it("is not rejected on fullfillment", async () => {
        const obj = await Promise.resolve("Zirak loves jQuery").reflect();
        assert(!obj.isRejected());
        const value = obj.value();
        assert.equal(value, "Zirak loves jQuery");
    });
    it("is rejected on rejections", async () => {
        const obj = await Promise.reject("Zirak loves jQuery").reflect();
        assert(obj.isRejected());
        assert(!obj.isFulfilled());
        const value = obj.reason();
        assert.equal(value, "Zirak loves jQuery");
    });
});
