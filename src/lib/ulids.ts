import { monotonicFactory } from "ulid";

/** Upper bound for a single invocation. */
export const MAX_COUNT = 1000000;

/**
 * A monotonic generator is required for the output to be sortable: a plain
 * `ulid()` randomises the 80-bit suffix on every call, so IDs created within
 * the same millisecond come out in arbitrary relative order. The factory
 * increments the suffix instead, which makes generation order and ascending
 * order the same thing.
 *
 * @see https://github.com/ulid/javascript#monotonic-ulids
 */
const nextUlid = monotonicFactory();

/**
 * Parses the optional `count` command argument.
 *
 * @throws If the input is not an integer within 1..{@link MAX_COUNT}.
 */
export function validateCount(input?: string): number {
  if (!input) {
    return 1;
  }

  const count = Number(input);
  if (Number.isNaN(count)) {
    throw new Error("Input value must be a number");
  }

  if (!Number.isInteger(count)) {
    throw new Error("Input value must be an integer");
  }

  if (count <= 0 || count > MAX_COUNT) {
    throw new Error(`Input value must be between 1 and ${MAX_COUNT.toLocaleString("en-US")}`);
  }

  return count;
}

/** Generates `count` ULIDs, already in ascending order. */
export function generateUlids(count: number): string[] {
  return Array.from({ length: count }, () => nextUlid());
}
