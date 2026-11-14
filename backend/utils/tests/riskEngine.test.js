
import test from "node:test";
import assert from "node:assert/strict";

import {
  calculateExposureRisk,
  buildRecommendations
} from "../riskEngine.js";

// Test 1: Empty exposure records
test("returns no known match when there are no exposure records", () => {
  const result = calculateExposureRisk([]);

  assert.equal(result.score, 0);
  assert.equal(result.level, "No known match");
  assert.deepEqual(result.factors, []);
});

// Test 2: Low risk classification
test("calculates low risk for low severity email exposure", () => {
  const records = [
    {
      severity: "Low",
      exposedDataTypes: ["email"]
    }
  ];

  const result = calculateExposureRisk(records);

  assert.equal(result.score, 16);
  assert.equal(result.level, "Low");
});

// Test 3: High risk classification
test("calculates high risk for critical password exposure", () => {
  const records = [
    {
      severity: "Critical",
      exposedDataTypes: ["password"]
    }
  ];

  const result = calculateExposureRisk(records);

  assert.equal(result.score, 68);
  assert.equal(result.level, "High");
});

// Test 4: Critical risk classification
test("calculates critical risk for multiple sensitive data types", () => {
  const records = [
    {
      severity: "Critical",
      exposedDataTypes: ["password", "session token"]
    }
  ];

  const result = calculateExposureRisk(records);

  assert.equal(result.score, 83);
  assert.equal(result.level, "Critical");
});

// Test 5: Multiple matching records
test("includes additional risk for multiple matching records", () => {
  const records = [
    {
      severity: "High",
      exposedDataTypes: ["email"]
    },
    {
      severity: "Low",
      exposedDataTypes: ["email"]
    }
  ];

  const result = calculateExposureRisk(records);

  assert.equal(result.score, 41);
  assert.equal(result.level, "Medium");

  assert.ok(
    result.factors.includes("2 matching dataset record(s)")
  );
});

// Test 6: Identifies exposed data types
test("identifies exposed data types in risk factors", () => {
  const records = [
    {
      severity: "High",
      exposedDataTypes: ["email", "phone"]
    }
  ];

  const result = calculateExposureRisk(records);

  assert.ok(
    result.factors.includes("Exposed data type: email")
  );

  assert.ok(
    result.factors.includes("Exposed data type: phone")
  );
});

// Test 7: Recommendations when no records exist
test("provides routine recommendations when no exposure is found", () => {
  const recommendations = buildRecommendations([]);

  assert.equal(recommendations.length, 2);

  assert.ok(
    recommendations.every(item => item.priority === "Routine")
  );

  assert.ok(
    recommendations.some(item => item.title === "Use unique passwords")
  );
});

// Test 8: Password exposure recommendations
test("recommends password changes and password reuse review", () => {
  const records = [
    {
      severity: "Critical",
      exposedDataTypes: ["password"]
    }
  ];

  const recommendations = buildRecommendations(records);

  const titles = recommendations.map(item => item.title);

  assert.ok(titles.includes("Change affected account passwords"));
  assert.ok(titles.includes("Review password reuse"));
});

// Test 9: Session token recommendations
test("recommends signing out other sessions when tokens are exposed", () => {
  const records = [
    {
      severity: "High",
      exposedDataTypes: ["session token"]
    }
  ];

  const recommendations = buildRecommendations(records);

  assert.ok(
    recommendations.some(
      item => item.title === "Sign out other sessions"
    )
  );
});

// Test 10: Payment data recommendations
test("recommends reviewing payment activity when payment data is exposed", () => {
  const records = [
    {
      severity: "High",
      exposedDataTypes: ["payment data"]
    }
  ];

  const recommendations = buildRecommendations(records);

  assert.ok(
    recommendations.some(
      item => item.title === "Review payment activity"
    )
  );
});
