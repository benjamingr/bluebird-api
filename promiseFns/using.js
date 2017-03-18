const unsafe = require("./utils/nextTick.js");

module.exports = (Bluebird) => {
    Bluebird.using = function(...disposersAndFn) {
        return new Promise((resolve, reject) => {
            const fn = disposersAndFn.pop();
            if(typeof fn !== "function") {
                throw new TypeError("Non function passed to using");
            }
            const results = Array(disposesrsAndFn.length);
            const remaining = disposesrsAndFn.length;
            let failed = false;
            for(let i = 0; i < disposersAndFn.length; i++) {
                const disposer = disposersAndFn[i];
                
                disposer._use.then(resource => {
                    if(failed) {
                        unsafe(() => disposer._cleanup());   
                    }
                    results[i] = {resource, disposer};
                    if(--remaining === 0) {
                        resolve(results.map(x => x.resource));
                    }
                }, e => {
                    failed = true;
                    // one failed, clean up all the others.
                    
                    unsafe(async () => {
                        for(const item of results) {
                            if(!item) continue;
                            await item._cleanup();
                        }
                        reject(e); // reject with the error
                    });
                })
            }
        })
        .then(fn) // run the actual function the user passed
        .finally(() => new Promise((resolve) => {
            // clean up and wait for it
            
            unsafe(async () => {
                for(const disposer of results) {
                    if(!disposer) continue; // guard against edge case
                    await disposer._cleanup();
                }
                resolve();
            });
        }));
    };
    // Bluebird.prototype.disposer = function disposer(fn) {
    //     return {
    //         _use: this,
    //         _cleanup: fn,
    //         then() { 
    //             throw new Error("A disposer is not a promise. Use it with `Promise.using`.")
    //         }
    //     };
    // };
};