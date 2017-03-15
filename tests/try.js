const assert = require("assert");
const Promise = require("../promise.js");

describe("try", () => {
    it("try works", async () => {
        let x = 1;
        await Promise.try(() => {
            x = 2;
        });
        assert.equal(x, 2);
    });
    it("try works with rejections", async () => {
        try {
            await Promise.try(() => {
                throw new Error();
            });
            assert.fail();
        } catch (e) { }
    });
});

const specify = it;

describe("try builtin tests", () => {
    const tryy = Promise.try;
    const error = new Error();

    const thrower = function() { throw error; };
    var identity = x => x;
    var array = Array.from.bind(Array);

    var receiver = function() { return this; };

    specify("should reject when the function throws", function() {
        var async = false;
        var ret = tryy(thrower).then(assert.fail, function(e) {
            assert(async);
            assert(e === error);
        });
        async = true;
        return ret;
    });

    specify("should reject when the function is not a function", function() {
        var async = false;
        var ret = tryy(null).then(assert.fail, function(e) {
            assert(async);
            assert(e instanceof TypeError);
        });
        async = true;
        return ret;
    });

    specify("should unwrap returned thenable", function(){
        return tryy(function(){
            return {
                then: function(f, v) {
                    f(3);
                }
            }
        }).then(function(v){
            assert(v === 3);
        });

    });
})