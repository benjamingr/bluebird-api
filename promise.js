class Bluebird extends Promise {
    tap(onFulfilled) {
        return Bluebird.resolve((async () => { 
            const value = await this;
            await onFulfilled(value);
            return value;
        })());
    }

    props() {
        return Bluebird.resolve((async () => {
            const value = await this;
            const ret = {};
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
    static props(o) { return Promise.resolve(o).props()}
}

module.exports = Bluebird;
