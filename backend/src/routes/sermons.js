import express from "express";
import multer from "multer";
import os from "os";
import { getSermons, uploadSermon, deleteSermon } from "../controllers/sermonsController.js";

const router = express.Router();

// Sermons are NOT kept on this server any more. Render's free plan erases the
// server's disk every time it restarts or goes to sleep, which is why old
// sermons stopped playing. Multer now only holds the file in a TEMPORARY
// folder while it is sent to Cloudinary, then the controller deletes it.
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, os.tmpdir()),
  filename: (req, file, cb) => {
    const ext = file.originalname.split(".").pop();
    cb(null, `sermon-${Date.now()}-${Math.round(Math.random() * 1e9)}.${ext}`);
  },
});

// Cloudinary's free plan accepts videos/audio up to 100MB. If you upgrade your
// Cloudinary plan, raise this by setting SERMON_MAX_MB on Render.
const MAX_MB = Number(process.env.SERMON_MAX_MB) || 100;

const upload = multer({
  storage,
  limits: { fileSize: MAX_MB * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("audio/") || file.mimetype.startsWith("video/")) {
      cb(null, true);
    } else {
      cb(new Error("Only audio or video files are allowed."));
    }
  },
});

router.get("/", getSermons);

router.post(
  "/",
  (req, res, next) => {
    upload.single("file")(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({ error: `That file is too large. The maximum size is ${MAX_MB}MB.` });
        }
        return res.status(400).json({ error: "File upload failed." });
      } else if (err) {
        // Our own fileFilter error ("Only audio or video files are allowed.")
        return res.status(400).json({ error: err.message });
      }
      next();
    });
  },
  uploadSermon
);

router.delete("/:id", deleteSermon);

export default router;