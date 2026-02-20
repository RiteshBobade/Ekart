import streamifier from "streamifier";
import cloudinary from "./cloudinary.js";

export const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: "auto", folder: "profilePics" },
      // (error, result) => {
      //   if (error) return reject(error);
      //   resolve(result);
      // }
      (error, result) => {
  if (error) {
    console.error("CLOUDINARY ERROR FULL:", error);
    return reject(error);
  }
  resolve(result);
}

    );

    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};
