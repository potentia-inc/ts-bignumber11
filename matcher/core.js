import { BigNumber, toBigNumber } from '../type.js';
// Sentinel for "no expected argument was passed" — distinct from `undefined`,
// which is a real value to compare against (so toBeBigNumber() is a type check
// but toBeBigNumber(undefined) is an equality check that fails).
const TYPE_ONLY = Symbol('type-only');
// Validate the argument count once (shared by every matcher) and report the
// mode: TYPE_ONLY when no argument was passed, else the expected value.
function expected(name, rest) {
    if (rest.length > 1)
        throw new Error(`${name}: expected at most one argument`);
    return rest.length === 0 ? TYPE_ONLY : rest[0];
}
function build(ctx, name, comment, pass, received, shown) {
    const { isNot, promise, utils } = ctx;
    const hint = utils.matcherHint(name, undefined, undefined, {
        comment,
        isNot,
        promise,
    });
    const not = pass ? 'not ' : '';
    return {
        pass,
        message: () => `${hint}\n\nExpected: ${not}${utils.printExpected(shown)}\n` +
            `Received: ${utils.printReceived(received)}`,
    };
}
// Build a matcher that checks `isType` alone (no argument) or type plus value
// equality (one argument). `convert` turns the expected argument into the value
// compared and displayed; a conversion that throws (e.g. an undefined or
// unparseable expected) counts as "not equal" rather than erroring.
function combined(name, label, isType, convert, equals) {
    return function (received, ...rest) {
        const arg = expected(name, rest);
        if (arg === TYPE_ONLY) {
            return build(this, name, `${label} type`, isType(received), received, label);
        }
        let pass = false;
        let shown = arg;
        try {
            shown = convert(arg);
            pass = isType(received) && equals(received, shown);
        }
        catch {
            pass = false;
        }
        return build(this, name, `${label} equality`, pass, received, shown);
    };
}
export const toBeBigNumber = combined('toBeBigNumber', 'BigNumber', (received) => BigNumber.isBigNumber(received), (expected) => toBigNumber(expected), (received, expected) => received.eq(expected));
export const toEqualBigNumber = toBeBigNumber;
export const toBeBigNumberString = combined('toBeBigNumberString', 'BigNumber string', (received) => typeof received === 'string' && isBigNumberString(received), (expected) => toBigNumber(expected), (received, expected) => toBigNumber(received).eq(expected));
export const toEqualBigNumberString = toBeBigNumberString;
export function toBeBigNumberNaN(received) {
    const pass = BigNumber.isBigNumber(received) && received.isNaN();
    return build(this, 'toBeBigNumberNaN', 'BigNumber NaN', pass, received, 'NaN');
}
export function toBeBigNumberNaNString(received) {
    return build(this, 'toBeBigNumberNaNString', 'BigNumber NaN string', received === 'NaN', received, 'NaN');
}
// A string is a BigNumber string when it parses to a valid (non-NaN) BigNumber.
function isBigNumberString(received) {
    try {
        toBigNumber(received);
        return true;
    }
    catch {
        return false;
    }
}
