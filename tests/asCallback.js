"use strict";

const assert = require("assert");
const testUtils = require("./helpers/util.js");

const Promise = require("../promise.js");

describe("asCallback", () => {
    it("converts to a callback form", done => {
        Promise.resolve(2).asCallback((err, data) => {
            assert.equal(data, 2);
            done();
        });
    });

    it("converts to a errback form", done => {
        Promise.reject(2).asCallback((err, data) => {
            assert.equal(err, 2);
            done();
        });
    });
    it("passes null as error when resolved", done => {
        Promise.resolve(2).asCallback((err, data) => {
            assert.strictEqual(err, null);
            done();
        });
    });
    it("spreads when spread option is passed", done => {
        Promise.resolve([1,2]).asCallback((err, one, two) => {
            assert.strictEqual(err, null);
            assert.equal(one, 1);
            assert.equal(two, 2);
            done();    
        }, {spread: true});
    });
    it("doesn't spread when spread option is passed false", done => {
        Promise.resolve([1,2]).asCallback((err, [one, two]) => {
            assert.strictEqual(err, null);
            assert.equal(one, 1);
            assert.equal(two, 2);
            done();
        }, {spread: false});

    });
});