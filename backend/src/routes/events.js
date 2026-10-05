import express from "express";
import multer from "multer";
import { getEvents, createEvent, updateEvent, deleteEvent } from "../controllers/eventsController.js";

const router = express.Router();

// Event posters are NOT saved on this server's disk any more (Render's free
// plan erases that disk on every restart, so posters kept vanishing).
// Multer holds the picture in memory just long enough for the controller to
// send it to Cloudinary, which stores it permanently.
const storage = multer.memoryStorage();

// Only accept actual images, capped at 8MB.
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

// Wraps multer so upload problems (wrong type, too big) come back as a clear
// message instead of a server crash.
const handleUpload = (req, res, next) => {
  upload.single("image")(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({ error: "That image is too large. The maximum size is 8MB." });
      }
      return res.status(400).json({ error: "Image upload failed." });
    } else if (err) {
      return res.status(400).json({ error: err.message });
    }
    next();
  });
};

router.get("/", getEvents);
router.post("/", handleUpload, createEvent);
router.put("/:id", handleUpload, updateEvent);
router.delete("/:id", deleteEvent);

export default router;