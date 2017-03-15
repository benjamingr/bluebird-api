module.exports = (Bluebird) => {
    Bluebird.prototype.call = function call(methodName) {
        const passedArgs = Array.prototype.slice.call(arguments, 1);
        return Bluebird.resolve((async () => {
            const obj = await this;
            if (obj && obj[methodName]) 
                return obj[methodName].call(obj, ...passedArgs)
            
            throw new Error(`Method ${methodName} doesn't exist on obj ${JSON.stringify(obj)}` );
        })());
    };
    
    Bluebird.call = (o, ...args) => Bluebird.resolve(o).call(...args);
};
