module.exports = (Bluebird) => {
    Bluebird.noConflict = () => {
        console.error("Please do not call noConflict with bluebird-api, simply do not import it!");
        console.error("See getNewLibraryCopy for copying bluebird");
    };
};