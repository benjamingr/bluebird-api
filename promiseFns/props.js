module.exports = (Bluebird) => {
 Bluebird.prototype.props = function props() {
        return Bluebird.resolve((async () => {
            const ret = {}, value = await this;
            if(typeof value !== "object" || value == null) {
                throw new TypeError("Expected an object passed to `.props`, got " + typeof value + " instead");
            }
            for(const key of Object.keys(value)) {
                ret[key] = await value[key];
            }
            return ret;
        })());
    };
    Bluebird.props = o => Bluebird.resolve(o).props();
};