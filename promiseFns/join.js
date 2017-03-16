module.exports = (Bluebird) => {
    Bluebird.join = async function join(...args) {
        const last = args.slice(-1)[0];

        if (typeof last === "function") {
            const otherArgs = args.slice(0, -1);
            let values = await Bluebird.all(otherArgs);
            return await last(...values);
        }
        else {
            return await Bluebird.all(args);
        }
    };
};