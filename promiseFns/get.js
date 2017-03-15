function indexedGetter(obj, index) {
    if (index < 0) index = Math.max(0, index + obj.length);
    return obj[index];
}

module.exports = (Bluebird) => {
    Bluebird.prototype.get = function get(prop) {
        return Bluebird.resolve((async () => {
            const value = await this;
		    const isIndex = (typeof prop === "number");
            if (!isIndex) {
                return value[prop]
            } else {
                return indexedGetter(value, prop)
            }
        })());
    };

    Bluebird.get = (promise, prop) => Bluebird.resolve(promise).get(prop);
};
