module.exports = function (Bluebird) {
     class OperationalError extends Error {
         constructor(message) {
             super(message);
        }
        get isOperational() {
            return true;
        }
    };
    Bluebird.OperationalError = OperationalError;
};