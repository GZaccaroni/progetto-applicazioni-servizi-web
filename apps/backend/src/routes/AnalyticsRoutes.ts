import { Router } from "express";
import { getAnalytics } from "@/controllers/AnalyticsController";

const AnalyticsRoutes = Router();

AnalyticsRoutes.route("/").post(getAnalytics);

export default AnalyticsRoutes;
