"use strict";

var assert = require("assert");
var testUtils = require("./helpers/util.js");

const Promise = require("../promise.js");

const MAGIC_NUMBER = 5578;

describe('coroutine', () => {
    it('works', async () => {
        let result = await Promise.coroutine(function* () {
            let answer = yield new Promise((resolve) => setTimeout(() => resolve(MAGIC_NUMBER), 500));

            return answer + 1;
        })();

        assert.equal(result, MAGIC_NUMBER + 1);
    });
});