if(typeof process !== "undefined" && typeof process.nextTick === "function") {
    module.exports = process.nextTick;
} else if (typeof setImmediate === "function") {
    module.exports = setImmediate;
} else {
    module.exports = setTimeout;
}