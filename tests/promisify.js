const assert = require("assert");
const Promise = require('../promise.js');

function oneArg(value, cb) {
    cb(null, value);
}

function twoArgs(value1, value2, cb) {
    cb(null, value1, value2);
}

function errors(err, cb) {
    cb(err);
}

function withThis(cb) {
    cb(null, this);
}

describe('promisify', () => {
    it('should work for one argument', async () => {
        const oneArgAsync = Promise.promisify(oneArg);
        const actual = await oneArgAsync(42);
        assert.equal(actual, 42);
    });

    it('should work for multiple returns', async () => {
        const twoArgsAsync = Promise.promisify(twoArgs, { multiArgs: true });
        const [one, two] = await twoArgsAsync(42, 43);
        
        assert.equal(one, 42);
        assert.equal(two, 43);
    });

    it('should work with context', async () => {
        const withThisAsync = Promise.promisify(withThis, {context: {actual: 42}});
        const { actual } = await withThisAsync();

        assert.equal(actual, 42);
    })

    it('should reject for errros', async () => {
        const errorsAsync = Promise.promisify(errors);
        try {
            await errorsAsync(new Error('foo'));
        } catch (e) {
            assert.equal(e.message, 'foo');
            return;
        }
        assert.fail('Should have thrown.');
    })
})