module.exports = (Bluebird) => {
    Bluebird.prototype.error = function error(handler) {
        return this.catch(isOperationalError, handler);
    };
    function isOperationalError(e) {
        if (e == null) return false;
        return (e instanceof Bluebird.OperationalError) || (e.isOperational === true);
    }
};
