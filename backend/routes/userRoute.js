// import express from "express";
// import { register, verify, login, logout, forgotPassword, verifyOTP, changePassword, allUsers, getUserById, updateUser } from "../controllers/userController.js";
// import { isAdmin, isAuthenticated } from "../middleware/authenticated.js";
// import { singleUpload } from "../middleware/multer.js";

// const router = express.Router();

// router.post("/register", register);
// router.route("/verify").get(verify).post(verify);
// router.post("/login", login);
// router.post("/logout", isAuthenticated, logout);
// router.post("/forgot-password", forgotPassword);
// router.post("/verify-otp/:email", verifyOTP);
// router.post("/change-password/:email", changePassword);
// router.get("/all-user", isAuthenticated, isAdmin, allUsers);
// router.get("/get-user/:userId", getUserById);
// router.put("/update/:", isAuthenticated, singleUpload, updateUser);


// export default router;

import express from "express";
import { register, verify, login, logout, forgotPassword, verifyOTP, changePassword, allUsers, getUserById, updateUser, adminUpdateUser, deleteUser } from "../controllers/userController.js";
import { isAdmin, isAuthenticated } from "../middleware/authenticated.js";
import { singleUpload } from "../middleware/multer.js";

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
router.put("/update", isAuthenticated, singleUpload, updateUser);
router.put("/adminUpdate/:userId", isAuthenticated, isAdmin, singleUpload, adminUpdateUser);
router.delete("/deleteUser/:userId", isAuthenticated, isAdmin, deleteUser);

export default router;