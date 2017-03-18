module.exports = (Bluebird) => {

    // this is tricky because we need to override how `then` works.
    // note that Zalgo is by-design impossible. 
    // setScheduler will defer using the native microtask scheduler and 
    // only then delay with the provided scheduler. This makes it still work
    // for things like notifying change detection - but you can never be quicker
    // than the built in scheduler. 
    
    // it is important that we get a reference to then before it might be externally
    // modified
    const originalThen = new Symbol();
    Bluebird.prototype[originalThen] = Bluebird.prototype.then; 
    Bluebird.setScheduler = function(scheduler) {
        Bluebird.prototype.then = function then(onFulfill, onReject) {
            return this[originalThen](
                v => new Promise(scheduler),
                e => new Promise((_, r) => scheduler(r))
            ).then(onFulfill, onReject);
        };
    };
};