import ActivityLog from "../models/ActivityLog.js";

export async function logActivity(req, { action, category = "System", description = "", severity = "Info", metadata = {} }) {
  try {
    await ActivityLog.create({
      actor: req.user?._id || null,
      actorName: req.user?.name || "System",
      action,
      category,
      description,
      severity,
      ipAddress: String(req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "").split(",")[0].slice(0, 80),
      metadata
    });
  } catch (error) {
    // Audit logging must not break the primary user operation.
    console.error("Activity log write failed:", error.message);
  }
}
