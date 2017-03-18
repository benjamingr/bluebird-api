module.exports = function (Bluebird) {
     class AggregateError extends Error {
         constructor(message) {
             super(message);
             this.length = 0;
        }
        _add(err) {
            this[this.length++] = err;
        }
        forEach(fn) {
            for(var i = 0; i < this.length; i++) {
                fn(this[i], i, this);
            }
        }
    };
    Bluebird.AggregateError = AggregateError;
};