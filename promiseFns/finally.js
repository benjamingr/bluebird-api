module.exports = (Bluebird) => {
    Bluebird.prototype.finally = function(onResolved) { 
        return Bluebird.resolve((async () => {
            try {
                var res = await this;
            } catch (e) {
                await onResolved();
                return e;
            }
            await onResolved();
            return res;
        })());
    };
};