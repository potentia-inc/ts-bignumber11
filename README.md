# @potentia/bignumber11

Cross-runtime utilities and test matchers for
[bignumber.js](https://github.com/MikeMcl/bignumber.js) `^11.0.0`.

- **Helpers** — `toBigNumber()` / `toBigNumberOrNil()` for lenient coercion.
- **Test matchers** — the same set of `BigNumber` matchers for
  [jest](https://jestjs.io), [vitest](https://vitest.dev) and
  [bun:test](https://bun.sh/docs/cli/test), plus a framework-agnostic entry
  point.

## Runtime support

Runs on **Node.js >= 22**, **Bun** and **Deno >= 2**. `bignumber.js` (`^11.0.0`)
is a **peer dependency** you provide:

```sh
npm install @potentia/bignumber11 bignumber.js
```

## Helpers

```typescript
import { toBigNumber, toBigNumberOrNil } from '@potentia/bignumber11'
// or import { ... } from '@potentia/bignumber11/type'

toBigNumber(0) // BigNumber(0)
toBigNumber('0') // BigNumber(0)
toBigNumber(1.234) // BigNumber(1.234)
toBigNumber('1.234') // BigNumber(1.234)
toBigNumber(Infinity) // BigNumber(Infinity)
toBigNumber(-Infinity) // BigNumber(-Infinity)

// strict coercion: throws on nullish and on invalid input (NaN included)
toBigNumber() // throws TypeError
toBigNumber(null) // throws TypeError
toBigNumber(NaN) // throws TypeError
toBigNumber('foobar') // throws TypeError

// the `...OrNil` variant returns undefined for nullish, but still throws on
// invalid input
toBigNumberOrNil() // undefined
toBigNumberOrNil(null) // undefined
toBigNumberOrNil(0) // BigNumber(0)
toBigNumberOrNil('foobar') // throws TypeError
```

These are strict coercions: a returned value is always a valid `BigNumber` (or
`±Infinity`). `toBigNumber()` returns its argument unchanged when it is already a
valid `BigNumber`, so it is safe to call repeatedly.

## Test matchers

The same matchers are exposed for three frameworks; only the import path differs.
Register them with `expect.extend()`:

| framework | import path                            | runtime |
| --------- | -------------------------------------- | ------- |
| jest      | `@potentia/bignumber11/matcher/jest`   | node    |
| vitest    | `@potentia/bignumber11/matcher/vitest` | node    |
| bun:test  | `@potentia/bignumber11/matcher/bun`    | bun     |

```typescript
// jest
import * as matchers from '@potentia/bignumber11/matcher/jest'
// vitest
// import { expect } from 'vitest'
// import * as matchers from '@potentia/bignumber11/matcher/vitest'
// bun:test
// import { expect } from 'bun:test'
// import * as matchers from '@potentia/bignumber11/matcher/bun'

expect.extend(matchers)
```

Importing the entry point also augments that framework's matcher types, so the
custom matchers are fully typed.

### Matchers

Each `toBe*` matcher does a **type check** when called with no argument and a
**type-and-value equality** check when given one. `toEqualBigNumber` /
`toEqualBigNumberString` are aliases for `toBeBigNumber` / `toBeBigNumberString`
— pick whichever reads better.

```typescript
import { BigNumber, toBigNumber } from '@potentia/bignumber11'

// toBeBigNumber: type (no arg) or value equality (one arg)
expect(toBigNumber(0)).toBeBigNumber()
expect(0n).not.toBeBigNumber() // 0n is not a BigNumber
expect(0).not.toBeBigNumber() // 0 is not a BigNumber
expect(toBigNumber(0)).toBeBigNumber(0)
expect(toBigNumber(0)).toEqualBigNumber('0')
expect(toBigNumber(0)).toEqualBigNumber(toBigNumber(0))
expect(toBigNumber(0)).not.toEqualBigNumber(1)
expect(0).not.toEqualBigNumber(0) // 0 is not a BigNumber
expect(toBigNumber(Infinity)).toEqualBigNumber(Infinity)

// toBeBigNumberString: a string that parses to a valid (non-NaN) BigNumber
expect('0').toBeBigNumberString()
expect('123.456').toBeBigNumberString()
expect('Infinity').toBeBigNumberString()
expect('NaN').not.toBeBigNumberString() // NaN is not a valid BigNumber
expect(0).not.toBeBigNumberString() // 0 is not a string
expect('123.456').toEqualBigNumberString(123.456)
expect('Infinity').toEqualBigNumberString(Infinity)

// toBeBigNumberNaN: a BigNumber that is NaN
expect(new BigNumber(NaN)).toBeBigNumberNaN()
expect(toBigNumber(0)).not.toBeBigNumberNaN()
expect(0).not.toBeBigNumberNaN() // 0 is not a BigNumber

// toBeBigNumberNaNString: the string 'NaN'
expect('NaN').toBeBigNumberNaNString()
expect('foobar').not.toBeBigNumberNaNString()
expect(0).not.toBeBigNumberNaNString() // 0 is not a string
```

### Framework-agnostic core

Each `matcher/jest`, `matcher/vitest` and `matcher/bun` entry point re-exports
the same framework-agnostic matcher functions and only adds that framework's
type augmentation. The matchers depend on nothing but the jest-compatible
`this.utils` that all three runners provide, so they can be called directly from
any runner.
