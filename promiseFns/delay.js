module.exports = (Bluebird) => {
    Bluebird.prototype.delay = function delay(ms) {
        return this.then(obj => new Bluebird((onFulfilled) => setTimeout(() => onFulfilled(obj), ms)));
    }
    Bluebird.delay = (ms, o) => Bluebird.resolve(o).delay(ms);
}
