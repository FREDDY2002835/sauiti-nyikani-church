import express from "express";
import multer from "multer";
import {
  getGalleryImages,
  uploadGalleryImage,
  updateGalleryImage,
  deleteGalleryImage,
} from "../controllers/galleryController.js";

const router = express.Router();

// Photos are no longer saved on this server's disk. Multer keeps the
// file in memory just long enough for the controller to send it to
// Cloudinary, which stores it and gives back a permanent link.
const storage = multer.memoryStorage();

// Only accept actual images, and cap size at 8MB.
const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed."));
    }
  },
});

router.get("/", getGalleryImages);
router.post("/", upload.single("image"), uploadGalleryImage);
router.put("/:id", updateGalleryImage);
router.delete("/:id", deleteGalleryImage);

export default router;