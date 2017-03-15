class Bluebird extends Promise {
    async tap(onFulfilled) {
        const value = await this;
        await onFulfilled(value);
        return value;
    }
}

module.exports = Bluebird;
