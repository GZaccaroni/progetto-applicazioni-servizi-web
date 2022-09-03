import { Router } from "express";
import ProductRoutes from "./ProductRoutes";
import AnalyticsRoutes from "./AnalyticsRoutes";
import OrderRoutes from "./OrderRoutes";
import CustomerRoutes from "./CustomerRoutes";
import StoreRoutes from "./StoreRoutes";
import UserRoutes from "./UserRoutes";
import { isUserLoggedIn } from "@/utils/utils";

const router = Router();

router.use("/product", isUserLoggedIn, ProductRoutes);
router.use("/order", isUserLoggedIn, OrderRoutes);
router.use("/customer", isUserLoggedIn, CustomerRoutes);
router.use("/analytics", isUserLoggedIn, AnalyticsRoutes);
router.use("/store", isUserLoggedIn, StoreRoutes);
router.use("/user", UserRoutes);

export default router;
