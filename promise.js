class Bluebird extends Promise {
    tap(onFulfilled) {
        return Bluebird.resolve((async () => { 
            const value = await this;
            await onFulfilled(value);
            return value;
        })());
    }
}

module.exports = Bluebird;
