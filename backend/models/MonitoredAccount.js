import mongoose from "mongoose";

const monitoredAccountSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  // Store a one-way SHA-256 digest rather than the raw email address.
  emailHash: { type: String, required: true, select: false },
  emailMasked: { type: String, required: true },
  label: { type: String, trim: true, maxlength: 60, default: "Personal account" },
  lastScannedAt: { type: Date, default: null },
  exposureCount: { type: Number, default: 0, min: 0 }
}, { timestamps: true });

monitoredAccountSchema.index({ user: 1, emailHash: 1 }, { unique: true });
export default mongoose.model("MonitoredAccount", monitoredAccountSchema);
