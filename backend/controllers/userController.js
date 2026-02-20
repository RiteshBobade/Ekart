import { Session } from "../models/sessionModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { verifyEmail } from "../emailVerify/verifyEmail.js";
import { sendOTPMail } from "../emailVerify/sendOTPMail.js";
import cloudinary from "../utils/cloudinary.js";
import { User } from "../models/userModel.js";
import { uploadToCloudinary } from "../utils/uploadToCloudinary.js";

/* REGISTER */
export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields required" });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
      expiresIn: "10m",
    });

    await User.findByIdAndUpdate(user._id, { token });
    await verifyEmail(token, email);

    return res.status(201).json({
      success: true,
      message: "Registered successfully. Please check your email.",
      token,
    });
  } catch (err) {
    console.error("REGISTRATION ERROR:", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

/* LOGIN */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    if (!user.isVerified) {
      return res
        .status(403)
        .json({ success: false, message: "Email not verified" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    const accessToken = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });
    const refreshToken = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
      expiresIn: "10d",
    });

    await Session.deleteMany({ userId: user._id });
    await Session.create({ userId: user._id, refreshToken });

    user.isLoggedIn = true;
    await user.save();

    const { password: pwd, token, ...safeUser } = user.toObject();

    return res.status(200).json({
      success: true,
      message: `Welcome back ${user.firstName}`,
      user: safeUser,
      accessToken,
      refreshToken,
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

/* VERIFY (Hybrid Support) */
export const verify = async (req, res) => {
  try {
    const token = req.query.token || req.headers.authorization?.split(" ")[1];
    if (!token)
      return res.status(401).json({ success: false, message: "Token missing" });

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const user = await User.findById(decoded.id);

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    user.isVerified = true;
    user.token = null;
    await user.save();

    return res
      .status(200)
      .json({ success: true, message: "Email verified successfully" });
  } catch {
    return res
      .status(401)
      .json({ success: false, message: "Invalid or expired token" });
  }
};

/* REVERIFY */
export const reVerify = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
      expiresIn: "10m",
    });
    user.token = token;
    await user.save();
    await verifyEmail(token, email);

    return res
      .status(200)
      .json({ success: true, message: "Verification email resent", token });
  } catch {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

/* LOGOUT */
export const logout = async (req, res) => {
  try {
    await Session.deleteMany({ userId: req.user._id });
    await User.findByIdAndUpdate(req.user._id, { isLoggedIn: false });
    return res
      .status(200)
      .json({ success: true, message: "Logged out successfully" });
  } catch {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

/* FORGOT PASSWORD */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email)
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });

    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000);
    user.resetPasswordOtp = otp;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
    await user.save();

    await sendOTPMail(otp, user.email);
    return res
      .status(200)
      .json({ success: true, message: "OTP sent to email" });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

/* VERIFY OTP PASSWORD */
export const verifyOTP = async (req, res) => {
  try {
    const { otp } = req.body;
    const email = req.params.email;
    if (!otp)
      return res
        .status(400)
        .json({ success: false, message: "OTP is required" });

    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    if (!user.resetPasswordOtp || !user.resetPasswordExpires) {
      return res
        .status(400)
        .json({ success: false, message: "OTP not generated" });
    }

    if (user.resetPasswordExpires < new Date()) {
      return res.status(400).json({ success: false, message: "OTP expired" });
    }

    if (String(otp).trim() !== String(user.resetPasswordOtp).trim()) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    user.resetPasswordOtp = null;
    user.resetPasswordExpires = null;
    await user.save();

    return res
      .status(200)
      .json({ success: true, message: "OTP verified successfully" });
  } catch (error) {
    console.error("OTP Verify Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

/* CHANGE PASSWORD */
export const changePassword = async (req, res) => {
  try {
    const { newPassword, confirmPassword } = req.body;
    const { email } = req.params;
    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    if (!newPassword || !confirmPassword)
      return res
        .status(400)
        .json({ success: false, message: "All fields required" });
    if (newPassword !== confirmPassword)
      return res
        .status(400)
        .json({ success: false, message: "Passwords do not match" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    return res
      .status(200)
      .json({ success: true, message: "Password changed successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

/* ALL USERS */
export const allUsers = async (_, res) => {
  try {
    const users = await User.find();
    return res.status(200).json({ success: true, users });
  } catch {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

/* GET USER BY ID */
export const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select(
      "-password -otp -otpExpiry -token",
    );
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    res.status(200).json({ success: true, user });
  } catch {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

// /* UPDATE USER */
// export const updateUser = async (req, res) => {
//   try {
//     const userIdToUpdate = req.user._id;
//     const loggedInUser = req.user;
//     const { firstName, lastName, address, city, zipCode, phoneNo, role } = req.body;

//     // Fixed 403 error: converting both IDs to strings for strict comparison

//     let user = await User.findById(userIdToUpdate);
//     if (!user) return res.status(404).json({ success: false, message: "User not found" });

//     let profilePicUrl = user.profilePic;
//     let profilePicPublicId = user.profilePicPublicId;

//     if (req.file) {
//       if (profilePicPublicId) {
//         await cloudinary.uploader.destroy(profilePicPublicId);
//       }
//       const uploadResult = await new Promise((resolve, reject) => {
//         const stream = cloudinary.uploader.upload_stream(
//           { folder: "profilePics" },
//           (error, result) => {
//             if (error) reject(error);
//             else resolve(result);
//           }
//         );
//         stream.end(req.file.buffer);
//       });
//       profilePicUrl = uploadResult.secure_url;
//       profilePicPublicId = uploadResult.public_id;
//     }

//     // Updating document fields - prioritizing new data or keeping old data
//     user.firstName = firstName || user.firstName;
//     user.lastName = lastName || user.lastName;
//     user.address = address || user.address;
//     user.city = city || user.city;
//     user.zipCode = zipCode || user.zipCode;
//     user.phoneNo = phoneNo || user.phoneNo;
//     user.role = role || user.role;
//     user.profilePic = profilePicUrl;
//     user.profilePicPublicId = profilePicPublicId;

//     const updatedUser = await user.save();

//     // Sync frontend by returning the safe, updated user object
//     const { password, token, ...safeUser } = updatedUser.toObject();

//     return res.status(200).json({
//       success: true,
//       message: "Profile updated successfully",
//       user: safeUser
//     });
//   } catch (error) {
//     console.error("UPDATE ERROR:", error);
//     return res.status(500).json({
//       success: false,
//       message: error.message || "Internal server error"
//     });
//   }
// };

// /* UPDATE USER */
// export const updateUser = async (req, res) => {
//   try {
//     // 🔒 Safety check
//     if (!req.user || !req.user._id) {
//       return res.status(401).json({
//         success: false,
//         message: "Unauthorized",
//       });
//     }

//     const userIdToUpdate = req.user._id;

//     const {
//       firstName,
//       lastName,
//       address,
//       city,
//       zipCode,
//       phoneNo,
//       role,
//     } = req.body;

//     // 🔎 Find user
//     const user = await User.findById(userIdToUpdate);

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     let profilePicUrl = user.profilePic;
//     let profilePicPublicId = user.profilePicPublicId;

//     // 🖼 If new image uploaded
//     if (req.file && req.file.buffer) {
//       try {
//         // Delete old image if exists
//         if (profilePicPublicId) {
//           await cloudinary.uploader.destroy(profilePicPublicId);
//         }

//         const uploadResult = await new Promise((resolve, reject) => {
//           const stream = cloudinary.uploader.upload_stream(
//             { folder: "profilePics" },
//             (error, result) => {
//               if (error) reject(error);
//               else resolve(result);
//             }
//           );
//           stream.end(req.file.buffer);
//         });

//         profilePicUrl = uploadResult.secure_url;
//         profilePicPublicId = uploadResult.public_id;

//       } catch (uploadError) {
//         console.error("Cloudinary Upload Error:", uploadError);
//         return res.status(500).json({
//           success: false,
//           message: "Image upload failed",
//         });
//       }
//     }

//     // 📝 Update only if value exists (prevents empty overwrite)
//     if (firstName) user.firstName = firstName;
//     if (lastName) user.lastName = lastName;
//     if (address) user.address = address;
//     if (city) user.city = city;
//     if (zipCode) user.zipCode = zipCode;
//     if (phoneNo) user.phoneNo = phoneNo;
//     if (role) user.role = role;

//     user.profilePic = profilePicUrl;
//     user.profilePicPublicId = profilePicPublicId;

//     const updatedUser = await user.save();

//     const userObj = updatedUser.toObject();
//     delete userObj.password;
//     delete userObj.token;

//     return res.status(200).json({
//       success: true,
//       message: "Profile updated successfully",
//       user: userObj,
//     });

//   } catch (error) {
//     console.error("UPDATE ERROR:", error);

//     return res.status(500).json({
//       success: false,
//       message: error.message || "Internal server error",
//     });
//   }
// };

export const updateUser = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const { firstName, lastName, address, city, zipCode, phoneNo, role } =
      req.body;

    // 🖼 Upload new image if exists
    if (req.file && req.file.buffer) {
      // delete old image
      if (user.profilePicPublicId) {
        await cloudinary.uploader.destroy(user.profilePicPublicId);
      }

      const result = await uploadToCloudinary(req.file.buffer);

      user.profilePic = result.secure_url;
      user.profilePicPublicId = result.public_id;
    }

    // Update only provided fields
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (address) user.address = address;
    if (city) user.city = city;
    if (zipCode) user.zipCode = zipCode;
    if (phoneNo) user.phoneNo = phoneNo;
    if (role) user.role = role;

    const updatedUser = await user.save();

    const userObj = updatedUser.toObject();
    delete userObj.password;
    delete userObj.token;

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: userObj,
    });
  } catch (error) {
    console.error("UPDATE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
