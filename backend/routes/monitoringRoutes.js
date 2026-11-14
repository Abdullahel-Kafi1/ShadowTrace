import { Router } from "express";
import { addMonitoredAccount, listMonitoredAccounts, removeMonitoredAccount, scanMonitoredAccount } from "../controllers/monitoringController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = Router();
router.use(requireAuth);
router.get("/accounts", listMonitoredAccounts);
router.post("/accounts", addMonitoredAccount);
router.delete("/accounts/:id", removeMonitoredAccount);
router.post("/accounts/:id/scan", scanMonitoredAccount);
export default router;
