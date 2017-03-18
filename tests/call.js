"use strict";

const assert = require("assert");
const testUtils = require("./helpers/util.js");

const Promise = require("../promise.js");


var c = {
    val: 3,
    method: function() {
        return [].slice.call(arguments).concat(this.val);
    }
};

describe("call", function() {
    it("0 args", function() {
        return Promise.resolve(c).call("method").then(function(res) {
            assert.deepEqual([3], res);
        });
    });
    it("1 args", function() {
        return Promise.resolve(c).call("method", 1).then(function(res) {
            assert.deepEqual([1, 3], res);
        });
    });
    it("2 args", function() {
        return Promise.resolve(c).call("method", 1, 2).then(function(res) {
            assert.deepEqual([1, 2, 3], res);
        });
    });
    it("3 args", function() {
        return Promise.resolve(c).call("method", 1, 2, 3).then(function(res) {
            assert.deepEqual([1, 2, 3, 3], res);
        });
    });
    it("10 args", function() {
        return Promise.resolve(c).call("method", 1, 2, 3, 4, 5, 6, 7, 8, 9, 10).then(function(res) {
            assert.deepEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 3], res);
        });
    });
    it("10 args called statically", function() {
        return Promise.call(c, "method", 1, 2, 3, 4, 5, 6, 7, 8, 9, 10).then(function(res) {
            assert.deepEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 3], res);
        });
    });
    it("method not found", function() {
        var promises = [
          Promise.resolve([]).call("abc").then(assert.fail, testUtils.noop),
          Promise.resolve([]).call("abc", 1, 2, 3, 4, 5, 6, 7).then(assert.fail, testUtils.noop),
          Promise.resolve([]).call("abc ").then(assert.fail, testUtils.noop),
          Promise.resolve(null).call("abc", 1, 2, 3, 4, 5, 6, 7).then(assert.fail, testUtils.noop),
          Promise.resolve(null).call("abc").then(assert.fail, testUtils.noop),
          Promise.resolve(null).call("abc ").then(assert.fail, testUtils.noop)
        ];

        return Promise.all(promises).then(function(errors) {
            for (var i = 0; i < errors.length; ++i) {
                var message = errors[i].message || errors[i].toString();
                assert(message.indexOf("doesn't exist on obj") >= 0);
            }
        });
    });
});
