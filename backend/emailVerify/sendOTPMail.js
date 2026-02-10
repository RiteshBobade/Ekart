import nodemailer from "nodemailer";
import "dotenv/config";

export const sendOTPMail = async (otp, email) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  const mailConfigurations = {
    from: process.env.MAIL_USER,
    to: email,
    subject: "Password Reset OTP",
    html: `<p> Hi! There, You have recently requested a password reset. Your OTP is <b>${otp}</b>. Please use this OTP to reset your password.</p>`,
  };

  await transporter.sendMail(mailConfigurations);
};