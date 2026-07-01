# Change log

## [2.0.0] - 2026-07-01

- **Breaking:** require Node.js >= 24 (was >= 22), in sync with the
  `@tsconfig/node24` build config. This is the only consumer-facing change --
  there are no API or runtime changes. All consumers already run Node >= 24 or
  Bun.
- Build with TypeScript 6 (dev toolchain), alongside eslint 10 and vitest 4.
  TS 6 no longer auto-includes `@types/*`, so `compilerOptions.types` is now set
  explicitly; `bun:test` still resolves through the local `types/bun-test.d.ts`
  shim and vitest through an explicit import.

## [1.0.0] - 2026-06-16

The first release.

- `toBigNumber()` / `toBigNumberOrNil()` helpers for
  [bignumber.js](https://github.com/MikeMcl/bignumber.js) `^11.0.0` (a peer
  dependency). These are strict coercions: `toBigNumber()` throws on nullish and
  on invalid input (`NaN` included), and `toBigNumberOrNil()` returns
  `undefined` for nullish but still throws on invalid input.
- Custom matchers for jest (`/matcher/jest`), vitest (`/matcher/vitest`) and
  bun:test (`/matcher/bun`), sharing one framework-agnostic core. Each `toBe*`
  matcher does a type check with no argument or value equality with one;
  `toEqualBigNumber` / `toEqualBigNumberString` are aliases. Matchers:
  `toBeBigNumber` / `toEqualBigNumber`, `toBeBigNumberString` /
  `toEqualBigNumberString`, `toBeBigNumberNaN`, `toBeBigNumberNaNString`.
- Cross-runtime support (Node.js >= 22, Bun, Deno >= 2) verified by a
  node/bun/deno CI matrix: node:test on node and deno, jest and vitest on node,
  and bun:test on bun.
