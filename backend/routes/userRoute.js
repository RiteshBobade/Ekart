
import express from "express";

import {

  register,

  verify,

  reVerify,

  login,

  logout,

  verifyOTP,

  changePassword,

  allUsers,

  getUserById,

} from "../controllers/userController.js";

import { isAdmin, isAuthenticated } from "../middleware/authenticated.js";

import { forgotPassword } from "../controllers/userController.js";



const router = express.Router();



router.post("/register", register);

router.route("/verify").get(verify).post(verify);

router.post("/reverify", reVerify);

router.post("/login", login);

router.post("/logout", isAuthenticated, logout);

router.post("/forgotPassword", forgotPassword);

router.post("/verifyOTP/:email", verifyOTP);

router.post("/changePassword/:email", changePassword);

router.get("/allUser",isAuthenticated,isAdmin, allUsers);  

router.get("/getUser/:userId", getUserById);





export default router;