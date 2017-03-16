module.exports = (Bluebird) => {
    Bluebird.cast = Promise.resolve;
};