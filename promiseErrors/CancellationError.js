module.exports = function (Bluebird) {
    // cancellation is not supported, but let's export the error type for compat
     class CancellationError extends Error {
         constructor(message) {
             super(message);
        }
    };
    Bluebird.CancellationError = CancellationError;
};