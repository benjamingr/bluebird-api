module.exports = (Bluebird) => {
    Bluebird.some = (prom, n) => Bluebird.resolve((async () =>
        Bluebird.resolve(prom).some(n)
    )());

    Bluebird.prototype.some = function(n) {
        return Bluebird.resolve((async () => {
            let count = 0;
            const promises = await this;
            if(promises.length === 0) {
                throw new TypeError("Not enough promises passed to call waiting for some promises")
            }
            const results = Array(n);
            let currentResult = 0;
            const err = new Bluebird.AggregateError("Not enough promises resolved in some");
            return new Bluebird((resolve, reject) => {
                for(const promise of promises) {
                    promise.then(v => {
                        //console.log("resolved");
                        count++;
                        results[currentResult++] = v;
                        if(count >= n) {
                            resolve(results);
                        }       
                    }, e => {
                        err._add(e);
                        //console.log("rejected", e, err.length, promises.length, n);
                        if(err.length > promises.length - n) {
                            reject(err);
                        }
                    });
                }
            })
            
        })());
    };
};