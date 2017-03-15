module.exports = (Bluebird) => {

    Promise.method = function(fn) {
        return function() { return Promise.try(fn); } 
    };
};