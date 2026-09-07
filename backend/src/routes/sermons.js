import express from "express";
import multer from "multer";
import { getSermons, uploadSermon, deleteSermon } from "../controllers/sermonsController.js";

const router = express.Router();

// Same disk-storage approach as gallery uploads - unique filenames so
// two sermons uploaded around the same time never collide.
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const ext = file.originalname.split(".").pop();
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}.${ext}`);
  },
});

// Only accept audio or video files. Sermons run much larger than photos,
// so the size cap here is bigger (200MB) than the gallery's 8MB - but
// still capped, so one huge upload can't fill the server's disk.
const upload = multer({
  storage,
  limits: { fileSize: 200 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("audio/") || file.mimetype.startsWith("video/")) {
      cb(null, true);
    } else {
      cb(new Error("Only audio or video files are allowed."));
    }
  },
});

router.get("/", getSermons);

router.post("/", (req, res, next) => {
  upload.single("file")(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({ error: "That file is too large. The maximum size is 200MB." });
      }
      return res.status(400).json({ error: "File upload failed." });
    } else if (err) {
      // Our own fileFilter error ("Only audio or video files are allowed.")
      return res.status(400).json({ error: err.message });
    }
    next();
  });
}, uploadSermon);

router.delete("/:id", deleteSermon);

export default router;
