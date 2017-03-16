module.exports = (Bluebird) => {

    Bluebird.prototype.return =
    Bluebird.prototype.thenReturn = function thenReturn(any) {
        return Bluebird.resolve((async () => {
            return any
        })());
    };

    Bluebird.return =
    Bluebird.thenReturn = function thenReturn(promise, any) {
        return Bluebird.resolve((async () => {
            return any
        })());
    };
};