// This file handles everything to do with the "sermons" table: listing
// sermons, uploading a new one (audio or video, with details), and
// deleting one.
//
// The audio/video files themselves are stored on Cloudinary (permanent),
// and only the link is saved in the database.

import fs from "fs";
import { pool } from "../config/db.js";
import cloudinary from "../config/cloudinary.js";

// Sends the sermon file to Cloudinary in chunks (safe for big files and does
// not load the whole file into memory). Cloudinary files audio under the
// "video" resource type, so we use "video" for both audio and video.
const uploadToCloudinary = (filePath) =>
  new Promise((resolve, reject) => {
    cloudinary.uploader.upload_large(
      filePath,
      {
        folder: "sauti-nyikani/sermons",
        resource_type: "video",
        chunk_size: 6000000,
      },
      (error, result) => (error ? reject(error) : resolve(result))
    );
  });

// Turns a Cloudinary link back into its "public id" so we can delete it.
// .../video/upload/v123/sauti-nyikani/sermons/abc.mp3 -> sauti-nyikani/sermons/abc
const getPublicId = (url) => {
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-zA-Z0-9]+$/);
  return match ? match[1] : null;
};

// GET /api/sermons - list all sermons, for the public Sermons page
export const getSermons = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM sermons ORDER BY sermon_date DESC NULLS LAST, id DESC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Failed to fetch sermons:", err.message);
    res.status(500).json({ error: "Something went wrong." });
  }
};

// POST /api/sermons - upload a new sermon (multipart/form-data, handled
// by multer before this function runs - the file itself is in req.file,
// everything else is in req.body like a normal form).
export const uploadSermon = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "An audio or video file is required." });
  }

  const tempPath = req.file.path;
  // Always remove the temporary file from the server, whatever happens.
  const cleanup = () => fs.unlink(tempPath, () => {});

  const {
    title_en, title_fr, title_sw,
    speaker,
    description_en, description_fr, description_sw,
    sermon_date,
  } = req.body;

  if (!title_en || !speaker) {
    cleanup();
    return res.status(400).json({ error: "Title and speaker are required." });
  }

  const fileType = req.file.mimetype.startsWith("video/") ? "video" : "audio";

  let fileUrl;
  try {
    const uploaded = await uploadToCloudinary(tempPath);
    fileUrl = uploaded.secure_url; // full https link, stored in the database
  } catch (err) {
    cleanup();
    console.error("Cloudinary sermon upload failed:", err.message);
    if (/too large/i.test(err.message || "")) {
      return res.status(400).json({
        error: "That file is too large for the storage plan. Please compress it or upgrade Cloudinary.",
      });
    }
    return res.status(502).json({ error: "Could not upload the sermon. Please try again." });
  }

  cleanup();

  try {
    const result = await pool.query(
      `INSERT INTO sermons
        (title_en, title_fr, title_sw, speaker, description_en, description_fr, description_sw, sermon_date, file_url, file_type)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [
        title_en, title_fr || title_en, title_sw || title_en,
        speaker,
        description_en || "", description_fr || "", description_sw || "",
        sermon_date || null,
        fileUrl, fileType,
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Failed to save sermon:", err.message);
    res.status(500).json({ error: "Something went wrong." });
  }
};

// DELETE /api/sermons/:id - remove a sermon (both the database row and
// the stored file).
export const deleteSermon = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM sermons WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Sermon not found." });
    }

    // New sermons live on Cloudinary; older ones (uploaded before the switch)
    // pointed to this server's disk, where the file is usually already gone.
    const fileUrl = result.rows[0].file_url || "";
    if (fileUrl.startsWith("http")) {
      const publicId = getPublicId(fileUrl);
      if (publicId) {
        cloudinary.uploader.destroy(publicId, { resource_type: "video" }).catch(() => {});
      }
    } else {
      fs.unlink(`.${fileUrl}`, () => {});
    }

    res.json({ success: true });
  } catch (err) {
    console.error("Failed to delete sermon:", err.message);
    res.status(500).json({ error: "Something went wrong." });
  }
};