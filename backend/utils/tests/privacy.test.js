
import test from "node:test";
import assert from "node:assert/strict";

import {
  normalizeEmail,
  hashEmail,
  maskEmail
} from "../privacy.js";

// Test 1: Email normalization
test("normalizes email by trimming spaces and converting to lowercase", () => {
  assert.equal(
    normalizeEmail("  Student@Gmail.COM  "),
    "student@gmail.com"
  );
});

// Test 2: Empty email handling
test("returns an empty string for empty email input", () => {
  assert.equal(normalizeEmail(""), "");
});

// Test 3: Consistent SHA-256 hashing
test("generates the same hash for equivalent email addresses", () => {
  const first = hashEmail("Student@gmail.com");
  const second = hashEmail(" student@gmail.com ");

  assert.equal(first, second);
});

// Test 4: Hash format
test("generates a 64-character hexadecimal SHA-256 hash", () => {
  const hash = hashEmail("student@shadowtrace.test");

  assert.match(hash, /^[a-f0-9]{64}$/);
});

// Test 5: Email masking
test("masks the local part of an email address", () => {
  const masked = maskEmail("student@gmail.com");

  assert.match(masked, /^s\*+t@gmail\.com$/);
});

// Test 6: Short email handling
test("handles an email with a one-character local part", () => {
  assert.doesNotThrow(() => {
    maskEmail("a@example.com");
  });
});
