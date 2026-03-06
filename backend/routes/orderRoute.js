import express from "express";
import { isAdmin, isAuthenticated } from "../middleware/authenticated.js";
import { createOrder, getAllOrdersAdmin, getMyOrder, getSalesData, getuserOrder, verifyPayment } from "../controllers/orderController.js";

const router = express.Router();

router.post("/create-order", isAuthenticated, createOrder);
router.post("/verify-payment", isAuthenticated, verifyPayment);
router.get("/myorder", isAuthenticated, getMyOrder); 
router.get("/all", isAuthenticated, isAdmin, getAllOrdersAdmin); 
router.get("/user-order/:userId", isAuthenticated, isAdmin, getuserOrder); 
router.get("/sales", isAuthenticated, isAdmin, getSalesData);





export default router;