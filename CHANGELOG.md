# Change log

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
