module.exports = (Bluebird) => {
    // no cancellation means simple implementation here
    Bluebird.prototype.suppressUnhandledRejections = function() {
        this.catch(() => {});
        return this;
    };
};