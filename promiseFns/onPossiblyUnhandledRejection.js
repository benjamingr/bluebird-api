module.exports = (Bluebird) => {
    Bluebird.onPossiblyUnhandledRejection = fn => {
        if(typeof process !== "undefined" && typeof process.on === "function") {
            process.on("unhandledRejection", (e, p) => {
                if(p instanceof Bluebird) {
                    fn(e, p);
                } else {
                    if(process.listenerCount("unhandledRejection") > 1) {
                        // existing listener
                        return false;
                    } else {
                        throw e; // default to throwing per Node's policy
                    }
                }
            });
        } else if (typeof window !== "undefined" && 
                   typeof window.addEventListener === "function") {
            window.addEventListener("unhandledrejection", e => {
                if(p instanceof Bluebird) {
                    fn(event.reason, event.promise);
                } 
                // default to throwing, this is the best we can do since we don't 
                // want to throw on other unrelated promises.
            });
        } else {
            throw new Error("Could not set unhandled rejection handler in this environment \
                            because native handlers do not exist.");
        }
    };
    Bluebird.onUnhandledRejectionHandled = () => {
        throw new Error("No one ever uses this API, if you do - let us know and I'll port it")
    };
}