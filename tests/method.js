const assert = require("assert");
const Promise = require("../promise.js");

describe("method", () => {
    it("wraps errors in promises", async () => {
        var p = Promise.method(() => {throw new Error("HEY");})();
        // gets here
        try {
            await p;
        } catch (e) {
            assert.equal(e.message, "HEY");
        }
    })
});

const specify = it;
describe("method bb tests", () => {
    var obj = {};
    var error = new Error();
    var thrower = Promise.method(function() {
        throw error;
    });

    var identity = Promise.method(function(val) {
        return val;
    });

    var array = Promise.method(function() {
        return [].slice.call(arguments);
    });

    var receiver = Promise.method(function() {
        return this;
    });

    specify("should reject when the function throws", function() {
        var async = false;
        var ret = thrower().then(assert.fail, function(e) {
            assert(async);
            assert(e === error);
        });
        async = true;
        return ret;
    });
    specify("should throw when the function is not a function", async function() {
        try {
            Promise.method(null);
            assert.fail();    
        }
        catch (e) {
            assert(e instanceof TypeError);
            return;
        }
    });
    specify("should call the function with the given receiver", function(){
        var async = false;
        var obj = {};
        var ret = receiver.call(obj).then(function(val) {
            assert(async);
            assert(val === obj);
        }, assert.fail);
        async = true;
        return ret;
    });
});