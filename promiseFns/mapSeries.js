module.exports = (Bluebird) => {
    Bluebird.prototype.mapSeries = function each(iterator) {
      return Bluebird.resolve((async () => { 
        const promises = await this;
        const length = promises.length;
        let ret = Array(length);
        
        for(let index = 0; index <= promises.length-1; index++){
          const value = await iterator(await promises[index], index, length);
          ret = ret.concat(value);
        };
        
        return ret;
      })());
    };

    Bluebird.mapSeries = (promise, iterator) => Bluebird.resolve(promise).mapSeries(iterator);
};