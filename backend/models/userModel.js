import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "user" },
    isVerified: { type: Boolean, default: false },
    isLoggedIn: { type: Boolean, default: false },
    token: { type: String, default: null },
    resetPasswordOtp: { type: Number },
    resetPasswordExpires: { type: Date },
    otp: { type: String },
    otpExpiry: { type: Date },
    // Fields required for profile updates
    phoneNo: { type: String },
    address: { type: String },
    city: { type: String },
    zipCode: { type: String },
    profilePic: { type: String, default: "" },
    profilePicPublicId: { type: String, default: "" },
  },
  { timestamps: true },
);

export const User = mongoose.model("User", userSchema);