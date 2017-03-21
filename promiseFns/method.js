module.exports = (Bluebird) => {

    Bluebird.method = function(fn) {
        if(typeof fn !== "function") {
            throw new TypeError("Non function passed to .method");
        }
        return async function() { 
            return fn.apply(this, arguments);
        }; 
    };
};