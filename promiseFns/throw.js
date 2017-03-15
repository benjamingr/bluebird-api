module.exports = (Bluebird) => {
    Bluebird.prototype.throw = function throwing(value) {
        return this.then(() => { throw value });
    };
};