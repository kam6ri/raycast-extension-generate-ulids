import { test, describe } from "node:test";
import assert from "node:assert/strict";

import { MAX_COUNT, generateUlids, validateCount } from "../src/lib/ulids.ts";

/** Crockford base32, as used by ULID. */
const ULID_PATTERN = /^[0-9A-HJKMNP-TV-Z]{26}$/;

describe("validateCount", () => {
  test("defaults to 1 when the argument is omitted or empty", () => {
    assert.equal(validateCount(undefined), 1);
    assert.equal(validateCount(""), 1);
  });

  test("accepts integers across the allowed range", () => {
    assert.equal(validateCount("1"), 1);
    assert.equal(validateCount("42"), 42);
    assert.equal(validateCount(String(MAX_COUNT)), MAX_COUNT);
  });

  test("rejects non-numeric input", () => {
    assert.throws(() => validateCount("abc"), /must be a number/);
  });

  test("rejects non-integers", () => {
    assert.throws(() => validateCount("1.5"), /must be an integer/);
    assert.throws(() => validateCount("Infinity"), /must be an integer/);
  });

  test("rejects values outside 1..MAX_COUNT", () => {
    assert.throws(() => validateCount("0"), /between 1 and/);
    assert.throws(() => validateCount("-1"), /between 1 and/);
    assert.throws(() => validateCount(String(MAX_COUNT + 1)), /between 1 and/);
  });
});

describe("generateUlids", () => {
  test("returns the requested number of well-formed ULIDs", () => {
    const ulids = generateUlids(100);
    assert.equal(ulids.length, 100);
    assert.ok(ulids.every((id) => ULID_PATTERN.test(id)));
  });

  test("returns unique values", () => {
    const ulids = generateUlids(10000);
    assert.equal(new Set(ulids).size, ulids.length);
  });

  test("returns values in ascending order without sorting", () => {
    // The regression this guards: a plain ulid() randomises the suffix, so IDs
    // created within the same millisecond come back in arbitrary order.
    const ulids = generateUlids(10000);
    assert.deepEqual(ulids, [...ulids].sort());
  });

  test("stays monotonic across separate calls", () => {
    const first = generateUlids(10);
    const second = generateUlids(10);
    assert.ok(first[first.length - 1] < second[0]);
  });
});
