import BigNumber from 'bignumber.js';
export { BigNumber };
function isNullish(x) {
    return x === null || x === undefined;
}
// Strict coercion: throw on nullish and on unparseable input. NaN counts as
// invalid, so a returned BigNumber is always a valid number (or ±Infinity). The
// `...OrNil` variant returns undefined for nullish but still throws on invalid
// input.
export function toBigNumber(x) {
    if (isNullish(x)) {
        throw new TypeError('cannot convert null or undefined to a BigNumber');
    }
    if (x instanceof BigNumber) {
        if (x.isNaN())
            throw new TypeError('cannot convert NaN to a valid BigNumber');
        return x;
    }
    let value;
    try {
        // bignumber.js >= 10 throws on unparseable input; older versions returned
        // a NaN BigNumber instead, which the isNaN() check below also rejects.
        value = new BigNumber(typeof x === 'number' ? x : String(x));
    }
    catch {
        throw new TypeError(`cannot convert to a valid BigNumber: ${String(x)}`);
    }
    if (value.isNaN()) {
        throw new TypeError(`cannot convert to a valid BigNumber: ${String(x)}`);
    }
    return value;
}
export function toBigNumberOrNil(x) {
    return isNullish(x) ? undefined : toBigNumber(x);
}
