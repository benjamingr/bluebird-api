module.exports = (Bluebird) => {
    Bluebird.prototype.catchReturn = function catchReturn (value) {
        const filters = Array.prototype.slice.call(arguments, 0, -1);
        
        return this.catch.apply(this, [ ...filters, () => value ]);
    }
};