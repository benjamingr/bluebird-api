module.exports = (Bluebird) => {

    Bluebird.prototype.reflect = async function() {
        try {
            const val = await this;
            return {
                reason() { throw new Error(); }, 
                value() { return val; }, 
                isFulfilled() { return true; },
                isRejected() { return false; }
            };
        } catch (e) {
            return {
                value() { throw new Error("Tried to get value of rejected promise"); },
                reason() { return e; }, 
                isFulfilled() { return false; },
                isRejected() { return true; }
            };
        }
    };
    // backwards compat Bluebird 2 method that works in Bluebird 3
    Bluebird.prototype.settle = arr => arr.map(Bluebird.resolve).map(x => x.reflect());
};