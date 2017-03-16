module.exports = (Bluebird) => {

    Bluebird.prototype.return =
    Bluebird.prototype.thenReturn = function thenReturn(prop) {
        return Bluebird.resolve((async () => {
            if(prop instanceof Bluebird) prop.catch(function() {})
            return prop
        })());
    };

    Bluebird.return =
    Bluebird.thenReturn = function thenReturn(promise, obj) {
        return Bluebird.resolve((async () => {
            if(prop instanceof Bluebird) prop.catch(function() {})
            return prop
        })());
    };
};