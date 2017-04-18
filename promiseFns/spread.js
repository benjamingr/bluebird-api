module.exports = (Bluebird) => {
    Bluebird.prototype.spread = function spread(fn) {
        return this.all().then(results => fn(...results));
    };
}