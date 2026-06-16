import { BigNumber, toBigNumber, toBigNumberOrNil } from '../src/type.js'
import * as matchers from '../src/matcher/jest.js'

expect.extend(matchers)

describe('@potentia/bignumber11/jest', () => {
  test('matchers', () => {
    const a = toBigNumber(123.45)
    // type check (no argument)
    expect(a).toBeBigNumber()
    expect(0n).not.toBeBigNumber()
    expect(0).not.toBeBigNumber()
    expect('0').not.toBeBigNumber()
    // equality (one argument) via toBe / toEqual
    expect(a).toBeBigNumber(123.45)
    expect(a).toEqualBigNumber('123.45')
    expect(a).toEqualBigNumber(a)
    expect(a).not.toEqualBigNumber(234.56)
    expect(toBigNumber(Infinity)).toEqualBigNumber(Infinity)
    expect(toBigNumber(-Infinity)).toEqualBigNumber(-Infinity)

    // string type check / equality
    expect('123.45').toBeBigNumberString()
    expect('Infinity').toBeBigNumberString()
    expect('NaN').not.toBeBigNumberString()
    expect('foobar').not.toBeBigNumberString()
    expect(0).not.toBeBigNumberString()
    expect('123.45').toEqualBigNumberString(123.45)
    expect('Infinity').toEqualBigNumberString(Infinity)
    expect('123.45').not.toEqualBigNumberString(234.56)

    // NaN
    expect(new BigNumber(NaN)).toBeBigNumberNaN()
    expect(a).not.toBeBigNumberNaN()
    expect(0).not.toBeBigNumberNaN()
    expect('NaN').toBeBigNumberNaNString()
    expect('foobar').not.toBeBigNumberNaNString()
  })

  test('toBigNumberOrNil()', () => {
    expect(toBigNumberOrNil(null)).toBeUndefined()
    expect(toBigNumberOrNil(undefined)).toBeUndefined()
    expect(toBigNumberOrNil(123.456)).toEqualBigNumber(123.456)
  })
})
