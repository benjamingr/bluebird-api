module.exports = (Bluebird) => {
    Bluebird.prototype.timeout = function (ms, rejectDesc) {

        return Bluebird.resolve((async () => {
            const PLACE_HOLDER = [];

            if (typeof rejectDesc === 'undefined') {
                rejectDesc = PLACE_HOLDER;
            }

            
            var winner = await Bluebird.race([this, Bluebird.delay(ms, rejectDesc)]);
            
            if (winner === rejectDesc) {
                if (rejectDesc instanceof Error)
                    throw rejectDesc;
                else if (winner === PLACE_HOLDER)
                    throw new Bluebird.TimeoutError();
                throw new Bluebird.TimeoutError(rejectDesc);
            }

            return winner;
        })());
    }
    Bluebird.timeout = (ms, rejectDesc, o) => Bluebird.resolve(o).delay(ms)
}
