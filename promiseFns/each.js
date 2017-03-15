module.exports = (Bluebird) => {
    Bluebird.prototype.each = function each(iterator) {
      return Bluebird.resolve((async () => { 
        const promises = await Promise.all(await this);
        const length = promises.length;
        
        for(let index = 0; index <= promises.length-1; index++){
          const value = await iterator(await promises[index], index, length);
        };
        return promises;
      })());
    };

    Bluebird.each = (promise, iterator) => Bluebird.resolve(promise).each(iterator);
};