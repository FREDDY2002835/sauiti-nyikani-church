import express from "express";
import multer from "multer";
import {
  getGalleryImages,
  uploadGalleryImage,
  updateGalleryImage,
  deleteGalleryImage,
} from "../controllers/galleryController.js";

const router = express.Router();

// Where uploaded photos get saved on disk, and how they're named.
// Using Date.now() + the original extension keeps filenames unique
// so two people uploading "photo.jpg" don't overwrite each other.
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const ext = file.originalname.split(".").pop();
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}.${ext}`);
  },
});

// Only accept actual images, and cap size at 8MB so one huge photo
// can't fill up the server's disk.
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
