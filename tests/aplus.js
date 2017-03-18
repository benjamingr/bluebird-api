// promises/a+ suite.
const promisesAplusTests = require("promises-aplus-tests");
const Promise = require("../promise.js");


// needed for aplus
process.on("unhandledRejection", (e, v) => {}); 

describe("Promises/A+ Tests", function () {
    require("promises-aplus-tests").mocha({
    resolved(v) { return Promise.resolve(v); },
    rejected(e) { return Promise.reject(e); },
    deferred() {
        let resolve, reject;
        let promise = new Promise((res, rej) => {
            resolve = res;
            reject = rej;
        });
        return {
            promise,
            resolve,
            reject
        };
    }
});
});