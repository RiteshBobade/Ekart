import express from "express";
import { register, verify, login, logout, forgotPassword, verifyOTP, changePassword, allUsers, getUserById } from "../controllers/userController.js";
import { isAdmin, isAuthenticated } from "../middleware/authenticated.js";

const router = express.Router();

router.post("/register", register);
router.route("/verify").get(verify).post(verify);
router.post("/login", login);
router.post("/logout", isAuthenticated, logout);
router.post("/forgotPassword", forgotPassword);
router.post("/verifyOTP/:email", verifyOTP);
router.post("/changePassword/:email", changePassword);
router.get("/allUser", isAuthenticated, isAdmin, allUsers);
router.get("/getUser/:userId", getUserById);

export default router;