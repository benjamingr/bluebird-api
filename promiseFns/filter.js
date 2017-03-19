const util = require("./util");
module.exports = (Bluebird) => {
    Bluebird.filter = (x, predicate, opts) => Bluebird.resolve(x).filter(predicate, opts);
    Bluebird.prototype.filter = async function(predicate, {concurrency} = {}) {
        const values = await this.all();
        const predicateResults = await this.map(predicate, {concurrency});
        const output = [];
        for(let i = 0; i < predicateResults.length; i++) {
            if(!predicateResults[i]) continue;
            output.push(values[i]);
        }
        return output;
    };
};

