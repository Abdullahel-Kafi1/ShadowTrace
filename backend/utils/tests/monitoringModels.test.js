
import test from "node:test";
import assert from "node:assert/strict";
import mongoose from "mongoose";

import MonitoredAccount from "../../models/MonitoredAccount.js";
import ExposureRecord from "../../models/ExposureRecord.js";

// Test 1: Monitored account requires a user reference
test("requires a user reference for monitored accounts", async () => {
  const account = new MonitoredAccount({
    emailHash: "abc123",
    emailMasked: "s****t@gmail.com"
  });

  await assert.rejects(
    account.validate(),
    (error) => {
      assert.equal(error.name, "ValidationError");
      assert.ok(error.errors.user);
      return true;
    }
  );
});

// Test 2: Monitored account requires an email hash
test("requires an email hash", async () => {
  const account = new MonitoredAccount({
    user: new mongoose.Types.ObjectId(),
    emailMasked: "s****t@gmail.com"
  });

  await assert.rejects(
    account.validate(),
    (error) => {
      assert.ok(error.errors.emailHash);
      return true;
    }
  );
});

// Test 3: Monitored account default values
test("sets default values for monitored accounts", () => {
  const account = new MonitoredAccount({
    user: new mongoose.Types.ObjectId(),
    emailHash: "abc123",
    emailMasked: "s****t@gmail.com"
  });

  assert.equal(account.label, "Personal account");
  assert.equal(account.exposureCount, 0);
  assert.equal(account.lastScannedAt, null);
});

// Test 4: Exposure record requires a source name
test("requires a source name for exposure records", async () => {
  const record = new ExposureRecord({
    emailHash: "abc123"
  });

  await assert.rejects(
    record.validate(),
    (error) => {
      assert.ok(error.errors.sourceName);
      return true;
    }
  );
});

// Test 5: Exposure record rejects invalid severity
test("rejects invalid exposure severity values", async () => {
  const record = new ExposureRecord({
    emailHash: "abc123",
    sourceName: "Test Dataset",
    severity: "Unknown"
  });

  await assert.rejects(
    record.validate(),
    (error) => {
      assert.ok(error.errors.severity);
      return true;
    }
  );
});

// Test 6: Exposure record default values
test("sets default values for synthetic exposure records", () => {
  const record = new ExposureRecord({
    emailHash: "abc123",
    sourceName: "Test Dataset"
  });

  assert.equal(record.severity, "Medium");
  assert.equal(record.isSynthetic, true);
  assert.equal(record.datasetVersion, "academic-demo-v1");
  assert.equal(record.description, "");
});
