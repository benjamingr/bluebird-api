const Bluebird = require("./promise.js");
module.exports = Bluebird

if (typeof window !== 'undefined') {
    window.Bluebird = Bluebird;
}