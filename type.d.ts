import BigNumber from 'bignumber.js';
export { BigNumber };
export type BigNumberOrNil = BigNumber | undefined;
export declare function toBigNumber(x?: unknown): BigNumber;
export declare function toBigNumberOrNil(x?: unknown): BigNumberOrNil;
