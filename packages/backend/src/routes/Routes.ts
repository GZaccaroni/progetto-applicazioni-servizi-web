import {Router} from "express";
import ProductRoutes from "./ProductRoutes";
import AnalyticsRoutes from "./AnalyticsRoutes";
import OrderRoutes from "./OrderRoutes";
import CustomerRoutes from "./CustomerRoutes";
import StoreRoutes from "./StoreRoutes";
import UserRoutes from "./UserRoutes";
const router=Router();

router.use("/product",ProductRoutes);
router.use("/order",OrderRoutes);
router.use("/customer",CustomerRoutes);
router.use("/analytics",AnalyticsRoutes);
router.use("/store",StoreRoutes);
router.use("/user",UserRoutes);


export default router;