import type { CustomMatchers } from './core.js';
export * from './core.js';
declare module 'bun:test' {
    interface Matchers<T = unknown> extends CustomMatchers<T> {
    }
    interface AsymmetricMatchers extends CustomMatchers {
    }
}
