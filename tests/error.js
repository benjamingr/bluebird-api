"use strict";

const assert = require("assert");
const Promise = require("../promise.js");

describe(".error", () => {
    
    it("Does not catch primitives", async () => {
        try {
            await Promise.reject(4).error(e => {});
            assert.fail();
        } catch (e) {
            assert.equal(e, 4);
        }
    });


    it("does not catch regular `Error`s", async () => {
        try {
            await Promise.reject(new Error()).error(e => {});
            assert.fail();
        } catch (e) {
            assert(!e.isOperational);
        }
    });
    
    it("does not catch regular `SyntaxError`s", async () => {
        try {
            await Promise.reject(new SyntaxError()).error(e => {});
            assert.fail();
        } catch (e) {
            assert(!e.isOperational);
        }
    });

    it("catches Promise.OperationalError instances", async () => {
        await Promise.reject(new Promise.OperationalError()).error(e => {});
    });
    
    it("catches Errors with isOperational true", async () => {
        var e = new Error();
        e.isOperational = true;
        await Promise.reject(e).error(e => {});
    });
    

    it("propagates on rethrow", async () => {
        try {
            await Promise.reject(new Promise.OperationalError()).error(e => { throw e;});
            assert.fail();
        } catch (e) {
            assert(e.isOperational);
        }
    });

    
    it("conserves .message", async () => {
        try {
            await Promise.reject(new Promise.OperationalError("HI")).error(e => { throw e;});
            assert.fail();
        } catch (e) {
            assert.equal(e.message, "HI");
        }
    });
});

describe("Weird errors -- bb test", function() {
    it("unwritable stack", function() {
        var e = new Error();
        var stack = e.stack;
        Object.defineProperty(e, "stack", {
            configurable: true,
            get: function() {return stack;},
            set: function() {throw new Error("cannot set");}
        });
        return new Promise(function(_, reject) {
            setTimeout(function() {
                reject(e);
            }, 1);
        }).catch(function(err) {
            assert.equal(e, err);
        });
    });
});

describe("OperationalError -- bb test - divergence!", function() {
    it("should not work without new", function() {
        try { 
            var a = Promise.OperationalError("msg");
        } catch (e) {}
        if(a) assert.fail();
    });
    it("should work with new", function() {
        var a = new Promise.OperationalError("msg");
        assert.strictEqual(a.message, "msg");
        assert(a instanceof Error);
    });
});