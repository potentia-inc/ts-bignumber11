import { strict as assert } from 'node:assert'
import { describe, test } from 'node:test'
import { BigNumber, toBigNumber, toBigNumberOrNil } from '../src/type.js'

describe('BigNumber', () => {
  test('toBigNumber()', () => {
    const a = toBigNumber(123.45)
    assert.equal(a instanceof BigNumber, true)
    assert.equal(a.toFixed(), '123.45')
    assert.equal(toBigNumber('1.234').toFixed(), '1.234')
    assert.equal(toBigNumber(a) === a, true) // returns the same instance
    assert.equal(toBigNumber(Infinity).eq(toBigNumber(Infinity)), true)
    assert.equal(toBigNumber(-Infinity).eq(toBigNumber(-Infinity)), true)
    assert.equal(toBigNumber(Infinity).eq(toBigNumber(-Infinity)), false)
  })

  test('toBigNumber() throws on nullish and invalid', () => {
    assert.throws(() => toBigNumber(), TypeError) // nullish
    assert.throws(() => toBigNumber(null), TypeError)
    assert.throws(() => toBigNumber(NaN), TypeError) // NaN is invalid
    assert.throws(() => toBigNumber('foobar'), TypeError)
    assert.throws(() => toBigNumber(''), TypeError)
    assert.throws(() => toBigNumber({}), TypeError)
    assert.throws(() => toBigNumber(new BigNumber(NaN)), TypeError) // NaN instance
  })

  test('toBigNumberOrNil()', () => {
    assert.equal(toBigNumberOrNil(null), undefined)
    assert.equal(toBigNumberOrNil(undefined), undefined)
    assert.equal(toBigNumberOrNil(123.456)?.eq(123.456), true)
    assert.throws(() => toBigNumberOrNil('foobar'), TypeError) // invalid still throws
    assert.throws(() => toBigNumberOrNil(NaN), TypeError)
  })

  test('BigNumber.prototype valueOf()', () => {
    assert.equal(+toBigNumber(0), 0)
    assert.equal('a' + toBigNumber(0), 'a0')
  })
})
