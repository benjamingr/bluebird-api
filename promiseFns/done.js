const schedule = require("./utils/nextTick.js");
module.exports = (Bluebird) => {
    Bluebird.prototype.done = function() {
        this.catch(e => schedule(() => { throw e; }) );
    };
};