module.exports = (Bluebird) => {
    Bluebird.prototype.caught = Promise.prototype.catch;
};