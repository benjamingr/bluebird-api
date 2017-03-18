module.exports = (Bluebird) => {
    // think: super.catch
    const super_catch = Promise.prototype.catch;

    Bluebird.prototype.catch = Bluebird.prototype.caught = function catchFn(fn) {
        if (arguments.length > 1) {
            const filters = Array.prototype.slice.call(arguments, 0, -1);
            fn = arguments[arguments.length - 1];

            return super_catch.call(this, filterCatch(filters, fn));
        }
        else {
            return super_catch.call(this, fn);
        }
    };

    function filterCatch(filters, fn) {
        return (error) => {
            for (const filter of filters) {
                if (testFilter(filter, error)) {
                    return fn(error); //TODO: deal with Bluebird.bind() here?
                }
            }

            return Bluebird.reject(error);
        };
    }
};

const FILTER_CONFIGS = [
    { // Error contructor
        filterTest: (t, error) => t && (t === Error || t.prototype instanceof Error),
        predicate: (t, error) => error instanceof t
    },
    { // function
        filterTest: (t, error) => typeof t === 'function',
        predicate: (fn, error) => fn(error)
    },
    { // else: Object shallow compare w/
        // note: we test the thrown error, not the filter argument as in previous filterTest()s. This is what bluebird does.
        filterTest: (o, error) => typeof error === 'function' || (typeof error === 'object' && error !== null),
        // To match Bluebird's behavior, uses ==, not === intentionally
        predicate: (filter, error) => !Object.keys(filter).some(key => filter[key] != error[key])
    }
];

function testFilter(filterArgument, error) {
    // get the right predicate function for the type of filter the user supplied.
    const filterConfig = FILTER_CONFIGS.find(filterConfig => 
        filterConfig.filterTest(filterArgument, error));
    const { predicate } = filterConfig || {};

    // If not filters are valid, we jist return false. It's not an exception
    return predicate && predicate(filterArgument, error);
}