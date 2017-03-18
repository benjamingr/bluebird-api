module.exports = (Bluebird) => {
    Bluebird.any = (prom, n) => Bluebird.resolve(prom).some(n);
    Bluebird.prototype.any = (n) => {
        return Bluebird.resolve((async () => {
            const items = await this;
            if(items.length === 0) {
                throw new TypeError("Passed 0 length array to .some");
            }
            let budget = items.length;
            const contest = items.map(x => Promise.resolve(x).reflect());
            do {
                budget--;
                const winrar = Promise.race(contest);
            } while(winrar.isRejected() && budget);
            return winrar.isFulfilled() ? winrar.value() : Promise.reject(winrar.reason());
        })());
    };
};