const escapePromiseCatch = require("./utils/nextTick.js");
module.exports = (Bluebird) => {
    Bluebird.prototype.asCallback = function asCallback(cb, opts) {
        const spread = opts && opts.spread;
        this.catch(() => {}); // opt out of unhandledRejection detection
        this.then(v => escapePromiseCatch (() => {
            if(spread) cb(null, ...v);
            else cb(null, v);
        }), e => escapePromiseCatch(() => cb(e)) );
    };
};