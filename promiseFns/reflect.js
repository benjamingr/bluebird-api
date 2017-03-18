module.exports = (Bluebird) => {
    Bluebird.prototype.reflect = async function() {
        try {
            const val = await this;
            return {
                isPending() { return false },
                reason() { throw new Error(); }, 
                value() { return val; }, 
                isFulfilled() { return true; },
                isRejected() { return false; }
            };
        } catch (e) {
            return {
                isPending() { return false },
                value() { throw new Error("Tried to get the value of a rejected promise"); },
                reason() { return e; }, 
                isFulfilled() { return false; },
                isRejected() { return true; }
            };
        }
    };
    // backwards compat Bluebird 2 method that works in Bluebird 3
    Bluebird.prototype.settle = arr => arr.map(Bluebird.resolve).map(x => x.reflect());
};