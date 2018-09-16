module.exports = {
    throttle,
    isPromise,
    isObject,
    classString
};

// slow implementation to start with. Should be "fast enough" for small concurrency values < 100;
function throttle(fn, concurrency = 20, Promise) {
    const workers = Array(concurrency).fill(Promise.resolve());
    const work = [];
    return function (...args) {
        let worker = workers.pop();
        if (worker === undefined) {
            let resolve, reject;
            const promise = new Promise((res, rej) => {
                resolve = res;
                reject = rej;
            });
            work.unshift({ args, resolve, reject, promise });
            return promise;
        }
        worker = worker.then(() => (fn(...args), null));
        worker.then(function pump() {
            if (work.length) {
                const {resolve, reject, args} = work.pop();
                worker = worker.then(() => fn(...args)).then(resolve, reject).then(pump);
            } else {
                workers.push(worker);
            }
            return null;
        });
        return worker;
    }
}

function isPromise(obj) {
    return obj && obj.then && (typeof(obj.then) === 'function');
}


function classString(obj) {
    return {}.toString.call(obj);
}

function isObject(value) {
    return typeof value === "function" ||
           typeof value === "object" && value !== null;
}
