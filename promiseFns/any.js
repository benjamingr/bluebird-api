module.exports = (Bluebird) => {
    Bluebird.any = (prom, n) => Bluebird.resolve((async () =>
        Bluebird.resolve(prom).any()
    )());

    Bluebird.prototype.any = async function() {
        // const items = await this;
        // if(items.length === 0) { throw new TypeError("0 promises passed to any")}
        return this.some(1).get(0); 
    }
};