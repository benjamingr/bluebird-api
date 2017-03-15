module.exports = (Bluebird) => {
    Bluebird.prototype.catchThrow = function catchThrow(value) {
        return this.catch(() => { throw value; });
    }
};