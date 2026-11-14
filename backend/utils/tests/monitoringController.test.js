
import test from "node:test";
import assert from "node:assert/strict";

import MonitoredAccount from "../../models/MonitoredAccount.js";
import ExposureRecord from "../../models/ExposureRecord.js";
import ActivityLog from "../../models/ActivityLog.js";

import {
  listMonitoredAccounts,
  addMonitoredAccount,
  removeMonitoredAccount,
  scanMonitoredAccount
} from "../../controllers/monitoringController.js";

function createResponse() {
  return {
    statusCode: 200,
    body: null,

    status(code) {
      this.statusCode = code;
      return this;
    },

    json(data) {
      this.body = data;
      return this;
    }
  };
}

function createRequest(overrides = {}) {
  return {
    user: {
      _id: "507f1f77bcf86cd799439011"
    },
    body: {},
    params: {},
    headers: {},
    socket: { remoteAddress: "127.0.0.1" },
    ...overrides
  };
}

function createQuery(result) {
  const query = {
    sort() {
      return this;
    },
    select() {
      return Promise.resolve(result);
    }
  };

  return query;
}

// Test 1: Retrieve monitored accounts
test("returns monitored accounts for the authenticated user", async (t) => {
  const accounts = [
    { _id: "account1", emailMasked: "s***@gmail.com" }
  ];

  t.mock.method(MonitoredAccount, "find", () =>
    createQuery(accounts)
  );

  const req = createRequest();
  const res = createResponse();

  await listMonitoredAccounts(req, res);

  assert.equal(res.statusCode, 200);
  assert.deepEqual(res.body.accounts, accounts);
});

// Test 2: Add a valid monitored account
test("adds a valid monitored account successfully", async (t) => {
  const account = {
    _id: "account1",
    emailMasked: "s***@gmail.com",
    label: "Personal account",
    lastScannedAt: null,
    exposureCount: 0,
    createdAt: new Date()
  };

  t.mock.method(MonitoredAccount, "findOne", () =>
    createQuery(null)
  );

  t.mock.method(MonitoredAccount, "create", async () => account);

  t.mock.method(ActivityLog, "create", async () => ({}));

  const req = createRequest({
    body: { email: "student@gmail.com" }
  });

  const res = createResponse();

  await addMonitoredAccount(req, res);

  assert.equal(res.statusCode, 201);
  assert.equal(res.body.message, "Account added for exposure monitoring.");
  assert.ok(res.body.account);
});

// Test 3: Reject invalid email
test("rejects an invalid email address", async () => {
  const req = createRequest({
    body: { email: "invalid-email" }
  });

  const res = createResponse();

  await addMonitoredAccount(req, res);

  assert.equal(res.statusCode, 400);
  assert.equal(res.body.message, "Enter a valid email address.");
});

// Test 4: Prevent duplicate monitored accounts
test("prevents adding an already monitored email", async (t) => {
  t.mock.method(MonitoredAccount, "findOne", () =>
    createQuery({ _id: "existing-account" })
  );

  const req = createRequest({
    body: { email: "student@gmail.com" }
  });

  const res = createResponse();

  await addMonitoredAccount(req, res);

  assert.equal(res.statusCode, 409);
  assert.equal(
    res.body.message,
    "This email is already being monitored."
  );
});

// Test 5: Remove an existing monitored account
test("removes an existing monitored account", async (t) => {
  t.mock.method(
    MonitoredAccount,
    "findOneAndDelete",
    async () => ({ _id: "account1" })
  );

  t.mock.method(ActivityLog, "create", async () => ({}));

  const req = createRequest({
    params: { id: "account1" }
  });

  const res = createResponse();

  await removeMonitoredAccount(req, res);

  assert.equal(res.statusCode, 200);
  assert.equal(res.body.message, "Monitored account removed.");
});

// Test 6: Reject removal of a nonexistent account
test("returns 404 when monitored account does not exist", async (t) => {
  t.mock.method(
    MonitoredAccount,
    "findOneAndDelete",
    async () => null
  );

  const req = createRequest({
    params: { id: "missing-account" }
  });

  const res = createResponse();

  await removeMonitoredAccount(req, res);

  assert.equal(res.statusCode, 404);
  assert.equal(res.body.message, "Monitored account not found.");
});

// Test 7: Reject scanning of a nonexistent account
test("returns 404 when scanning an unknown account", async (t) => {
  t.mock.method(MonitoredAccount, "findOne", () =>
    createQuery(null)
  );

  const req = createRequest({
    params: { id: "missing-account" }
  });

  const res = createResponse();

  await scanMonitoredAccount(req, res);

  assert.equal(res.statusCode, 404);
  assert.equal(res.body.message, "Monitored account not found.");
});

// Test 8: Scan an existing monitored account
test("scans an account and returns exposure analysis", async (t) => {
  const account = {
    _id: "account1",
    emailHash: "a".repeat(64),
    emailMasked: "s***@gmail.com",
    label: "Personal account",
    lastScannedAt: null,
    exposureCount: 0,
    save: async function () {
      return this;
    }
  };

  const records = [
    {
      _id: "record1",
      sourceName: "Synthetic Test Dataset",
      breachDate: new Date("2025-01-20"),
      exposedDataTypes: ["Email address", "Password"],
      severity: "High",
      description: "Synthetic test exposure",
      datasetVersion: "academic-demo-v1",
      isSynthetic: true
    }
  ];

  t.mock.method(MonitoredAccount, "findOne", () =>
    createQuery(account)
  );

  t.mock.method(ExposureRecord, "find", () =>
    createQuery(records)
  );

  t.mock.method(ActivityLog, "create", async () => ({}));

  const req = createRequest({
    params: { id: "account1" }
  });

  const res = createResponse();

  await scanMonitoredAccount(req, res);

  assert.equal(res.statusCode, 200);
  assert.equal(
    res.body.message,
    "Exposure analysis completed against the available simulated dataset."
  );
  assert.equal(res.body.summary.exposureCount, 1);
  assert.ok(res.body.summary.riskScore >= 0);
  assert.ok(Array.isArray(res.body.recommendations));
  assert.equal(res.body.exposures.length, 1);
  assert.equal(account.exposureCount, 1);
  assert.ok(account.lastScannedAt instanceof Date);
});
