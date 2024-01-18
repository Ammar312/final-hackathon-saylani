import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const uploadCloudinary = async (filepath) => {
  try {
    if (!filepath) {
      return null;
    }
    // upload file on cloudinary
    const response = await cloudinary.uploader.upload(filepath, {
      resource_type: "auto",
    });
    console.log("cloudinary", response);
    return response;
  } catch (error) {
    fs.unlinkSync(filepath);
    return null;
  }
};
export default uploadCloudinary;
