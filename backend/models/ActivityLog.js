import mongoose from "mongoose";

const activityLogSchema = new mongoose.Schema({
  actor: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null, index: true },
  actorName: { type: String, trim: true, maxlength: 120, default: "System" },
  action: { type: String, required: true, trim: true, maxlength: 100 },
  category: { type: String, enum: ["Authentication", "Monitoring", "Threat Intelligence", "Reporting", "Administration", "System"], default: "System", index: true },
  description: { type: String, trim: true, maxlength: 500, default: "" },
  severity: { type: String, enum: ["Info", "Warning", "High", "Critical"], default: "Info" },
  ipAddress: { type: String, maxlength: 80, default: "" },
  metadata: { type: mongoose.Schema.Types.Mixed, default: {} }
}, { timestamps: true });

activityLogSchema.index({ createdAt: -1, category: 1 });
export default mongoose.model("ActivityLog", activityLogSchema);
