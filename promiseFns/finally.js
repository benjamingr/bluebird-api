module.exports = (Bluebird) => {
    Bluebird.prototype.finally = async function(onResolved) {
        try {
            var res = await this;
        } catch (e) {
            onResolved();
            return e;
        }
        onResolved();
        return res;
    }
};