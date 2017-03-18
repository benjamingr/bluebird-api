module.exports = (Bluebird) => {
    Bluebird.defer = function defer() {
        let resolve, reject, 
            promise = new Bluebird((res, rej) => [resolve, reject] = [res, rej]);
        return { promise, resolve, reject}
    };
}
