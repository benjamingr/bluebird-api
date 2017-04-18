module.exports = (Bluebird, logger) => {
    function warningThen(onFulfilled, onRejected) {
        if(!logger.active){
            return super.then(onFulfilled, onRejected);
        }
        if(typeof onFulfilled !== "function" && onFulfilled !== null) { // explicit `then(null, handler)` case
            try { throw new Error(); } catch (e) { // get stack
                console.warn(" Warning: .then's onFulfilled only accepts functions, got ", onFulfilled, e);
            }
        }
        if(typeof onRejected !== "function") {
            try { throw new Error(); } catch (e) { // get stack
                console.warn(" Warning: .then's onRejected only accepts functions, got ", onRejected, e);
            }
        }
        return super.then(onFulfilled, onRejected);
    }
    return warningThen;
};