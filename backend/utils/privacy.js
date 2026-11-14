import { createHash } from "node:crypto";

export function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

export function hashEmail(email) {
  return createHash("sha256").update(normalizeEmail(email), "utf8").digest("hex");
}

export function maskEmail(email) {
  const [local, domain] = normalizeEmail(email).split("@");
  if (!local || !domain) return "***";
  const visible = local.length <= 2 ? local[0] : `${local[0]}${"*".repeat(Math.min(local.length - 2, 8))}${local.slice(-1)}`;
  return `${visible}@${domain}`;
}
