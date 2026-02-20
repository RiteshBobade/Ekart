import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";

export const isAuthenticated = async (req, res, next) => {
  console.log(req.headers.authorization);

  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Token missing",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    // 🔥 FIX: handle both id and _id
    const userId = decoded.id || decoded._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Invalid token payload",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("AUTH ERROR:", error);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};


export const isAdmin = (req, res, next) => {
  // Checks if the user exists and has the 'admin' role
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({ 
      success: false, 
      message: "Access denied: Admins Only" 
    });
  }
};
