const assert = require("assert");
const Promise = require("../promise.js");
const join = Promise.join;

function wrap(fn, ...args) {
    return function() {
        return fn.apply(this, args);
    }
}

function returnThenable(thenable, expected) {
    const promise = Promise.resolve(true)
    return promise.thenReturn(thenable).then(function(v){
        assert(v === expected);
    });
}

function returnThenableReject(thenable, expected) {
    const promise = Promise.resolve(true)
    return promise.thenReturn(thenable).then(assert.fail, function(v){
        assert(v === expected);
    });
}

function returnValue(value) {
    const promise = Promise.resolve(true)
    return promise.thenReturn(value).then(function(v){
        assert(v === value);
    });
}


function handlePromise(val, done) {
    if (val && typeof val.then === "function") {
        val.then(success(done), fail(done));
    }
}

function testRejected(reason, test) {
    specify("already-rejected", function (done) {
        handlePromise(test(rejected(reason), done), done);
    });
}

describe("thenReturn", function () {
    it("forwards errors", () => {
        return Promise.reject(10)
            .thenReturn(100)
            .then(assert.fail, assert.ok);
    });
});

describe("thenReturn", function () {

    describe("primitives", function() {
        specify("null", wrap(returnValue, null));
        specify("undefined", wrap(returnValue, void 0));
        specify("string", wrap(returnValue, "asd"));
        specify("number", wrap(returnValue, 3));
        specify("boolean", wrap(returnValue, true));
    });

    describe("objects", function() {
        specify("plain", wrap(returnValue, {}));
        specify("function", wrap(returnValue, function(){}));
        specify("built-in function", wrap(returnValue, Array));
        specify("built-in object", wrap(returnValue, Math));
    });

    describe("thenables", function() {
        describe("which fulfill", function() {
            specify("immediately", wrap(returnThenable, {
                then: function(f) {
                    f(10);
                }
            }, 10));
            specify("eventually", wrap(returnThenable, {
                then: function(f) {
                    setTimeout(function() {
                        f(10);
                    }, 1);
                }
            }, 10));
        });
        describe("which reject", function(){
            specify("immediately", wrap(returnThenableReject, {
                then: function(f, r) {
                    r(10);
                }
            }, 10));
            specify("eventually", wrap(returnThenableReject, {
                then: function(f, r) {
                    setTimeout(function() {
                        r(10);
                    }, 1);
                }
            }, 10));
        });
    });

    describe("promises", function() {
        describe("which fulfill", function() {
            specify("already", wrap(returnThenable, Promise.resolve(10), 10));
        });
        describe("which reject", function() {
            var alreadyRejected = Promise.reject(10);
            alreadyRejected.then(assert.fail, function(){});
            specify("already", wrap(returnThenableReject, alreadyRejected, 10));
        });

    });

    specify("doesn't swallow errors", function() {
        var e = {};
        testRejected(e, function(promise){
            return promise.thenReturn(3).then(assert.fail, function(err) {
                assert(err = e);
            });
        });
    });
});