module.exports = (Bluebird) => {
    Bluebird.prototype.catchThrow = function catchThrow(value) {
        const filters = Array.prototype.slice.call(arguments, 0, -1);
        
        return this.catch.apply(this, [ ...filters, () => { throw value; } ]);
    }
};