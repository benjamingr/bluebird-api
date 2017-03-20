module.exports = function (Bluebird) {
    require("./OperationalError.js")(Bluebird);
    class TimeoutError extends Bluebird.OperationalError {
        constructor(message) {
            super(message || "timeout error");
        }

    };
    Bluebird.TimeoutError = TimeoutError;
};
