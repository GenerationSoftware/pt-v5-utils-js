/**
 * Converts milliseconds to seconds
 * @param milliseconds milliseconds as a number
 * @returns
 */
export const msToS = (ms: number | bigint) => {
  if (!ms) {
    return 0;
  }
  if (typeof ms === 'bigint') {
    return Number(ms / BigInt(1_000));
  } else {
    return ms / 1_000;
  }
};

/**
 * Converts seconds to milliseconds
 * @param seconds seconds as a number
 * @returns
 */
export const sToMs = (seconds: number) => {
  if (!seconds) {
    return 0;
  }
  return seconds * 1_000;
};
