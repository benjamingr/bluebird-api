const unsafe = require("./utils/nextTick.js");

module.exports = (Bluebird) => {
    Bluebird.using = function(...disposersAndFn) {
        let fn;
        const results = Array(disposersAndFn.length);
        return new Bluebird((resolve, reject) => {
            fn = disposersAndFn.pop();
            if(typeof fn !== "function") {
                throw new TypeError("Non function passed to using");
            }
            let remaining = disposersAndFn.length;
            let failed = false;
            for(let i = 0; i < disposersAndFn.length; i++) {
                const disposer = disposersAndFn[i];
                const handleErr = e => {
                    failed = true;
                    // one failed, clean up all the others.            
                    unsafe(async () => {
                        for(const item of results) {
                            if(!item) continue;
                            if(!item.disposer) continue;
                            await item.disposer._cleanup();
                        }
                        reject(e); // reject with the error
                    });
                };
                if(disposer._use) { 
                    disposer._use.then(resource => {    
                        if(failed) {
                            //todo: hold reject until these finish?
                            unsafe(() => disposer._cleanup());   
                        }
                        results[i] = {resource, disposer};
                        if(--remaining === 0) {
                            resolve(results.map(x => x.resource));
                        }
                    }, handleErr);
                } else if (disposer.then) {
                    Bluebird.resolve(disposer).then(resource => {
                        results[i] = {resource};
                        if(--remaining === 0) {
                            resolve(results.map(x => x.resource));
                        }
                    }, handleErr);
                }
            }
        })
        .then(res => fn(...res)) // run the actual function the user passed
        .finally(v => new Bluebird((resolve) => {
            // clean up and wait for it
            unsafe(async () => {
                for(const disposer of results) {
                    if(!disposer) continue; // guard against edge case
                    if(!disposer.disposer) continue; // promise and not disposer
                    await disposer.disposer._cleanup();
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