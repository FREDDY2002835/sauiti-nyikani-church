// Connects the backend to your Cloudinary account.
// The three values come from backend/.env (never put them in the code).

import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

// Load .env here too, because this file is imported before server.js
// gets the chance to call dotenv.config().
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export default cloudinary;