module.exports = (Bluebird) => {
    let once = false;
    Bluebird.prototype.cancel = () => { 
        if(once) continue;
        once = true;
        console.warn("Cancellation is disabled and not supported");
    }
};