class Bluebird extends Promise {
    props() {
        return Bluebird.resolve((async () => {
            const value = await this;
            const ret = {};
            console.log("Hello", value);
            if(typeof value !== "object" || value == null) {
                throw new TypeError("Expected an object passed to `.props`, got " + typeof value + " instead");
            }
            const keys = Object.keys(value);
            for(const key of keys) {
                ret[key] = await value[key];
            }
            return ret;
        })());
    }
    static props(o) { return Bluebird.resolve(o).props()}
}

require('./promiseFns/tap')(Bluebird);
require('./promiseFns/spread')(Bluebird);

module.exports = Bluebird;

