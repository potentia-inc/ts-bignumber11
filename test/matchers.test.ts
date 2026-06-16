import { strict as assert } from 'node:assert'
import { describe, test } from 'node:test'
import { BigNumber, toBigNumber } from '../src/type.js'
import * as matchers from '../src/matcher/core.js'
import type { MatcherContext } from '../src/matcher/core.js'

// A minimal jest-compatible `this.utils` so the framework-agnostic matcher
// logic can be exercised on any runtime without a test framework installed.
const ctx: MatcherContext = {
  isNot: false,
  promise: '',
  utils: {
    matcherHint: () => '',
    printReceived: (v) => String(v),
    printExpected: (v) => String(v),
  },
}

const nan = new BigNumber(NaN)

describe('matchers (framework-agnostic core)', () => {
  test('toBeBigNumber: type with no arg, equality with an arg', () => {
    // no argument -> type check
    assert.equal(matchers.toBeBigNumber.call(ctx, toBigNumber(0)).pass, true)
    assert.equal(matchers.toBeBigNumber.call(ctx, nan).pass, true) // still a BigNumber
    assert.equal(matchers.toBeBigNumber.call(ctx, 0).pass, false)
    assert.equal(matchers.toBeBigNumber.call(ctx, 0n).pass, false)
    assert.equal(matchers.toBeBigNumber.call(ctx, '0').pass, false)
    // argument -> equality (toEqualBigNumber is the same function)
    assert.equal(matchers.toBeBigNumber.call(ctx, toBigNumber(0), 0).pass, true)
    assert.equal(
      matchers.toEqualBigNumber.call(ctx, toBigNumber(0), '0').pass,
      true,
    )
    assert.equal(
      matchers.toEqualBigNumber.call(ctx, toBigNumber(0), toBigNumber(0)).pass,
      true,
    )
    assert.equal(
      matchers.toEqualBigNumber.call(ctx, toBigNumber(0), 1).pass,
      false,
    )
    assert.equal(matchers.toEqualBigNumber.call(ctx, 0, 0).pass, false) // not a BigNumber
    assert.equal(
      matchers.toBeBigNumber.call(ctx, toBigNumber(Infinity), Infinity).pass,
      true,
    )
    // an unparseable / NaN expected is an equality check that fails, not an error
    assert.equal(
      matchers.toEqualBigNumber.call(ctx, toBigNumber(0), NaN).pass,
      false,
    )
    assert.equal(matchers.toBeBigNumber.call(ctx, nan, undefined).pass, false)
  })

  test('toBeBigNumberString: type with no arg, equality with an arg', () => {
    assert.equal(matchers.toBeBigNumberString.call(ctx, '0').pass, true)
    assert.equal(matchers.toBeBigNumberString.call(ctx, '123.456').pass, true)
    assert.equal(matchers.toBeBigNumberString.call(ctx, 'Infinity').pass, true)
    assert.equal(matchers.toBeBigNumberString.call(ctx, 'NaN').pass, false)
    assert.equal(matchers.toBeBigNumberString.call(ctx, 'foobar').pass, false)
    assert.equal(matchers.toBeBigNumberString.call(ctx, 0).pass, false)
    assert.equal(matchers.toBeBigNumberString.call(ctx, 0n).pass, false)
    // equality
    assert.equal(
      matchers.toEqualBigNumberString.call(ctx, '123.456', 123.456).pass,
      true,
    )
    assert.equal(
      matchers.toEqualBigNumberString.call(ctx, 'Infinity', Infinity).pass,
      true,
    )
    assert.equal(matchers.toEqualBigNumberString.call(ctx, '0', 1).pass, false)
    assert.equal(matchers.toEqualBigNumberString.call(ctx, 0, 0).pass, false)
  })

  test('toBeBigNumberNaN', () => {
    assert.equal(matchers.toBeBigNumberNaN.call(ctx, nan).pass, true)
    assert.equal(
      matchers.toBeBigNumberNaN.call(ctx, toBigNumber(0).div(0)).pass,
      true,
    )
    assert.equal(
      matchers.toBeBigNumberNaN.call(ctx, toBigNumber(0)).pass,
      false,
    )
    assert.equal(matchers.toBeBigNumberNaN.call(ctx, 0).pass, false)
    assert.equal(matchers.toBeBigNumberNaN.call(ctx, NaN).pass, false)
  })

  test('toBeBigNumberNaNString', () => {
    assert.equal(matchers.toBeBigNumberNaNString.call(ctx, 'NaN').pass, true)
    assert.equal(
      matchers.toBeBigNumberNaNString.call(ctx, 'foobar').pass,
      false,
    )
    assert.equal(matchers.toBeBigNumberNaNString.call(ctx, 0).pass, false)
  })

  test('throws when given more than one argument', () => {
    assert.throws(
      () => matchers.toBeBigNumber.call(ctx, toBigNumber(0), 0, 1),
      /at most one/,
    )
  })

  test('message() renders a string', () => {
    assert.equal(typeof matchers.toBeBigNumber.call(ctx, 5).message(), 'string')
    assert.equal(
      typeof matchers.toEqualBigNumber.call(ctx, 5, 6).message(),
      'string',
    )
    assert.equal(
      typeof matchers.toBeBigNumberNaN.call(ctx, 5).message(),
      'string',
    )
  })
})
