import { BigNumber, toBigNumber } from '../type.js'

// Framework-agnostic matcher implementations shared by the jest, vitest and bun
// adapters. They rely only on the jest-compatible `this.utils` that all three
// runners provide, so this module has zero test-framework dependencies.

export interface MatcherUtils {
  matcherHint: (
    name: string,
    received?: string,
    expected?: string,
    options?: { comment?: string; isNot?: boolean; promise?: string },
  ) => string
  printReceived: (value: unknown) => string
  printExpected: (value: unknown) => string
}

export interface MatcherContext {
  // Optional so the richer jest/bun/vitest contexts (where these are optional)
  // remain assignable to this shared shape - keeping expect.extend(matchers)
  // type-safe for consumers without a cast.
  isNot?: boolean
  promise?: string
  utils: MatcherUtils
}

export interface MatcherResult {
  pass: boolean
  message: () => string
}

// Each toBe*/toEqual* matcher checks a type when called with no argument, or
// type-and-value equality when given one. `toBe*` and `toEqual*` are the same
// function under two names; pick whichever reads better.
export interface CustomMatchers<R = unknown> {
  toBeBigNumber(expected?: unknown): R
  toEqualBigNumber(expected: unknown): R
  toBeBigNumberString(expected?: unknown): R
  toEqualBigNumberString(expected: unknown): R
  toBeBigNumberNaN(): R
  toBeBigNumberNaNString(): R
}

type Matcher = (
  this: MatcherContext,
  received: unknown,
  ...rest: unknown[]
) => MatcherResult

// Sentinel for "no expected argument was passed" - distinct from `undefined`,
// which is a real value to compare against (so toBeBigNumber() is a type check
// but toBeBigNumber(undefined) is an equality check that fails).
const TYPE_ONLY = Symbol('type-only')

// Validate the argument count once (shared by every matcher) and report the
// mode: TYPE_ONLY when no argument was passed, else the expected value.
function expected(name: string, rest: unknown[]): unknown {
  if (rest.length > 1) throw new Error(`${name}: expected at most one argument`)
  return rest.length === 0 ? TYPE_ONLY : rest[0]
}

function build(
  ctx: MatcherContext,
  name: string,
  comment: string,
  pass: boolean,
  received: unknown,
  shown: unknown,
): MatcherResult {
  const { isNot, promise, utils } = ctx
  const hint = utils.matcherHint(name, undefined, undefined, {
    comment,
    isNot,
    promise,
  })
  const not = pass ? 'not ' : ''
  return {
    pass,
    message: () =>
      `${hint}\n\nExpected: ${not}${utils.printExpected(shown)}\n` +
      `Received: ${utils.printReceived(received)}`,
  }
}

// Build a matcher that checks `isType` alone (no argument) or type plus value
// equality (one argument). `convert` turns the expected argument into the value
// compared and displayed; a conversion that throws (e.g. an undefined or
// unparseable expected) counts as "not equal" rather than erroring.
function combined(
  name: string,
  label: string,
  isType: (received: unknown) => boolean,
  convert: (expected: unknown) => unknown,
  equals: (received: unknown, expected: unknown) => boolean,
): Matcher {
  return function (this: MatcherContext, received, ...rest): MatcherResult {
    const arg = expected(name, rest)
    if (arg === TYPE_ONLY) {
      return build(
        this,
        name,
        `${label} type`,
        isType(received),
        received,
        label,
      )
    }
    let pass = false
    let shown: unknown = arg
    try {
      shown = convert(arg)
      pass = isType(received) && equals(received, shown)
    } catch {
      pass = false
    }
    return build(this, name, `${label} equality`, pass, received, shown)
  }
}

export const toBeBigNumber = combined(
  'toBeBigNumber',
  'BigNumber',
  (received) => BigNumber.isBigNumber(received),
  (expected) => toBigNumber(expected),
  (received, expected) =>
    (received as BigNumber).eq(expected as BigNumber.Value),
)
export const toEqualBigNumber = toBeBigNumber

export const toBeBigNumberString = combined(
  'toBeBigNumberString',
  'BigNumber string',
  (received) => typeof received === 'string' && isBigNumberString(received),
  (expected) => toBigNumber(expected),
  (received, expected) => toBigNumber(received).eq(expected as BigNumber.Value),
)
export const toEqualBigNumberString = toBeBigNumberString

export function toBeBigNumberNaN(
  this: MatcherContext,
  received: unknown,
): MatcherResult {
  const pass = BigNumber.isBigNumber(received) && received.isNaN()
  return build(this, 'toBeBigNumberNaN', 'BigNumber NaN', pass, received, 'NaN')
}

export function toBeBigNumberNaNString(
  this: MatcherContext,
  received: unknown,
): MatcherResult {
  return build(
    this,
    'toBeBigNumberNaNString',
    'BigNumber NaN string',
    received === 'NaN',
    received,
    'NaN',
  )
}

// A string is a BigNumber string when it parses to a valid (non-NaN) BigNumber.
function isBigNumberString(received: string): boolean {
  try {
    toBigNumber(received)
    return true
  } catch {
    return false
  }
}
