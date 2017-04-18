module.exports = function (Bluebird) {
     class OperationalError extends Error {
         constructor(message) {
             super(message);
        }
        get isOperational() {
            return true;
        }

        static fromError(err) {
            return Object.assign(new OperationalError(err.message), {
                stack: err.stack
            });
        }
    };
    Bluebird.OperationalError = OperationalError;
};