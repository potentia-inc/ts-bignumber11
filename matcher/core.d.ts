export interface MatcherUtils {
    matcherHint: (name: string, received?: string, expected?: string, options?: {
        comment?: string;
        isNot?: boolean;
        promise?: string;
    }) => string;
    printReceived: (value: unknown) => string;
    printExpected: (value: unknown) => string;
}
export interface MatcherContext {
    isNot?: boolean;
    promise?: string;
    utils: MatcherUtils;
}
export interface MatcherResult {
    pass: boolean;
    message: () => string;
}
export interface CustomMatchers<R = unknown> {
    toBeBigNumber(expected?: unknown): R;
    toEqualBigNumber(expected: unknown): R;
    toBeBigNumberString(expected?: unknown): R;
    toEqualBigNumberString(expected: unknown): R;
    toBeBigNumberNaN(): R;
    toBeBigNumberNaNString(): R;
}
type Matcher = (this: MatcherContext, received: unknown, ...rest: unknown[]) => MatcherResult;
export declare const toBeBigNumber: Matcher;
export declare const toEqualBigNumber: Matcher;
export declare const toBeBigNumberString: Matcher;
export declare const toEqualBigNumberString: Matcher;
export declare function toBeBigNumberNaN(this: MatcherContext, received: unknown): MatcherResult;
export declare function toBeBigNumberNaNString(this: MatcherContext, received: unknown): MatcherResult;
export {};
