import mongoose from "mongoose";

const exposureRecordSchema = new mongoose.Schema({
  emailHash: { type: String, required: true, index: true, select: false },
  sourceName: { type: String, required: true, trim: true },
  breachDate: { type: Date, default: null },
  exposedDataTypes: [{ type: String, trim: true }],
  severity: { type: String, enum: ["Low", "Medium", "High", "Critical"], default: "Medium" },
  description: { type: String, maxlength: 1000, default: "" },
  datasetVersion: { type: String, default: "academic-demo-v1" },
  isSynthetic: { type: Boolean, default: true }
}, { timestamps: true });

exposureRecordSchema.index({ emailHash: 1, breachDate: -1 });
export default mongoose.model("ExposureRecord", exposureRecordSchema);
