Promise.resolve([1,2,3]).get(0).then(console.log); // logs 1 

Promise.resolve({x:3, y:5}).get('x').then(console.log); // logs 3

class Bluebird extends Promise {
    tap(onFulfilled) {
        const value = await this;
        await onFulfilled(value);
        return value;
    }
}

module.exports = Bluebird;
