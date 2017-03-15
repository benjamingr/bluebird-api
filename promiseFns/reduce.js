module.exports = (Bluebird) => {
    Bluebird.prototype.reduce = function reduce(reducer, initialValue) {
      return Bluebird.resolve((async () => { 
        const promises = await this;
        const length = promises.length;
        if (length === 0) return await initialValue;
        
        let ret;
        if (initialValue == undefined){
          let first = promises.shift();
          ret = await first;
        }else{
          ret = await initialValue;
        }
        
        for(let index = 0; index <= promises.length-1; index++){
          const value = await promises[index];
          ret = await reducer(ret, value, index, length);
        };
        
        return ret;
        })());
    };

    Bluebird.reduce = (promise, reducer, initialValue) => Bluebird.resolve(promise).reduce(reducer, initialValue);
};