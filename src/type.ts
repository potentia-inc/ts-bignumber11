import BigNumber from 'bignumber.js'
export { BigNumber }

export type BigNumberOrNil = BigNumber | undefined

function isNullish(x: unknown): x is null | undefined {
  return x === null || x === undefined
}

// Strict coercion: throw on nullish and on unparseable input. NaN counts as
// invalid, so a returned BigNumber is always a valid number (or ±Infinity). The
// `...OrNil` variant returns undefined for nullish but still throws on invalid
// input.

export function toBigNumber(x?: unknown): BigNumber {
  if (isNullish(x)) {
    throw new TypeError('cannot convert null or undefined to a BigNumber')
  }
  if (x instanceof BigNumber) {
    if (x.isNaN())
      throw new TypeError('cannot convert NaN to a valid BigNumber')
    return x
  }
  let value: BigNumber
  try {
    // bignumber.js >= 10 throws on unparseable input; older versions returned
    // a NaN BigNumber instead, which the isNaN() check below also rejects.
    value = new BigNumber(typeof x === 'number' ? x : String(x))
  } catch {
    throw new TypeError(`cannot convert to a valid BigNumber: ${String(x)}`)
  }
  if (value.isNaN()) {
    throw new TypeError(`cannot convert to a valid BigNumber: ${String(x)}`)
  }
  return value
}

export function toBigNumberOrNil(x?: unknown): BigNumberOrNil {
  return isNullish(x) ? undefined : toBigNumber(x)
}
