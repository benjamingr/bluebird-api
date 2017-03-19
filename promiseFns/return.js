module.exports = (Bluebird) => {

    Bluebird.prototype.return =
    Bluebird.prototype.thenReturn = function thenReturn(any) {
        return Bluebird.resolve((async () => {
            await this;
            return any
        })());
    };
};
