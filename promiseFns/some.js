module.exports = (Bluebird) => {
    Bluebird.some = (prom, n) => Bluebird.resolve(prom).some(n);
    Bluebird.prototype.some = (n) => {
        return Bluebird.resolve((async () => {
            let count = 0;
            const items = await this;
            const results = Array(n);
            let currentResult = 0;
            const err = new Bluebird.AggregateError("Not enough promises resolved in some");
            return new Promise((resolve, reject) => {
                for(const promise of promises) {
                    promise.then(v => {
                        count++;
                        results[currentResult++] = v;
                        if(count >= n) {
                            resolve(results);
                        }       
                    }, e => {
                        err._add(e);
                        if(err.length >= items.length - n) {
                            reject(err);
                        }
                    });
                }
            })
            
        })());
    };
};