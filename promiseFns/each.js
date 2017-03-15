module.exports = (Bluebird) => {
    Bluebird.prototype.each = function each(iterator) {
      return Bluebird.resolve((async () => { 
        const promises = await this;
        let ret = [];
        const length = promises.length;
        
        for(let index=0; index<=promises.length-1; index++){
          const value = await iterator(await promises[index], index, length);
          ret = ret.concat(value);
        };
        
        return ret;
        })());
    };

    Bluebird.each = (promise, iterator) => Bluebird.resolve(promise).each(iterator);
};