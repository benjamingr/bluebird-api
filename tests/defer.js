"use strict";

const assert = require("assert");
const testUtils = require("./helpers/util.js");
const Promise = require("../promise.js");

describe("defer back-compat", () => {
    it("exists", () => {
        const d = Promise.defer();
    });
    it("has a promise property", () => {
        const defer = Promise.defer();
        assert(defer.promise);
        assert(defer.promise instanceof Promise);
    });
    it("has resolve/reject props", () => {
        const defer = Promise.defer();
        assert(defer.resolve);
        assert(defer.reject);
        assert(defer.resolve.call);
    });
    it("resolves with the value", async () => {
        const defer = Promise.defer();
        defer.resolve(3);
        assert.equal(await defer.promise, 3);
    });
    it("resolves with the first value", async () => {
        const defer = Promise.defer();
        defer.resolve(3);
        defer.resolve(2);
        assert.equal(await defer.promise, 3);
    });
    it("resolves with the first value when rejected", async () => {
        const defer = Promise.defer();
        defer.resolve(3);
        defer.reject(2);
        assert.equal(await defer.promise, 3);
    });
    it("rejects with the err", async () => {
        const defer = Promise.defer();
        defer.reject(2);
        try {
            const p = await defer.promise;
            assert.fail();
        } catch(e) {
            assert.equal(e, 2);
        }
    });
    it("rejects with the first err", async () => {
        const defer = Promise.defer();
        defer.reject(2);
        defer.reject(3);
        try {
            const p = await defer.promise;
            assert.fail();
        } catch(e) {
            assert.equal(e, 2);
        }
    });
});