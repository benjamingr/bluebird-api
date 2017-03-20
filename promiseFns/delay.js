module.exports = (Bluebird) => {
    Bluebird.prototype.delay = function delay(ms) {

        return Bluebird.resolve((async() => {
            const obj = await this;
            return new Bluebird((onFulfilled) => {
                setTimeout(() => onFulfilled(obj), ms);
            });
        })());
    }


    Bluebird.delay = (ms, o) => Bluebird.resolve(o).delay(ms);
}
