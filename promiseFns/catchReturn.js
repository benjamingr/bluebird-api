module.exports = (Bluebird) => {
    Bluebird.prototype.catchReturn = function catchReturn (value) {
        return this.catch(() => value);
    }
};