module.exports = (Bluebird) => {
    Promise.join = async function join(...args) {
        var last = args.pop();
        if(typeof last !== "function") {
            throw new TypeError("Promise.join's last parameter should be a function")
        }
        var values = await Promise.all(args)
        return await last(...values);
    };
};