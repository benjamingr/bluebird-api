const assert = require("assert");
const Promise = require("../promise.js");

describe("OperationalError", () => {
    
    it("is on the promise object", () => {
        assert(Promise.OperationalError);
    });

    it("is an error OperationalError", () => {
        assert(new Promise.OperationalError() instanceof Error);
    });
    
    it("is operational", () => {
        assert((new Promise.OperationalError).isOperational);
    });

    it("has a stack property", () => {
        let err;
        try {
            throw new Promise.OperationalError;
        } catch (e) {
            err = e;
        }
        assert("stack" in err);
    });

});