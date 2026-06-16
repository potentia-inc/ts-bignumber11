// Build-time shim so `src/bun.ts` can augment the `bun:test` module's matcher
// interfaces without depending on `@types/bun` (whose ambient globals conflict
// with `@types/node`, used by the rest of the build). This only provides enough
// of `bun:test` for the augmentation to resolve at our build time; it is not
// part of the published package, and consumers running bun supply the real
// `bun:test` types, which our generated `bun.d.ts` then augments.
declare module 'bun:test' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface Matchers<T = unknown> {}
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface AsymmetricMatchers {}
}
