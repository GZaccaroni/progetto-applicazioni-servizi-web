import { Router } from "express";
import { getAnalytics } from "../controllers/AnalyticsController";

const AnalyticsRoutes = Router();

AnalyticsRoutes.route("/").get(getAnalytics);

export default AnalyticsRoutes;
