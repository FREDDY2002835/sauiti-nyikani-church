// This file handles everything to do with the "sermons" table: listing
// sermons, uploading a new one (audio or video, with details), and
// deleting one.

import fs from "fs";
import { pool } from "../config/db.js";

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

  const {
    title_en, title_fr, title_sw,
    speaker,
    description_en, description_fr, description_sw,
    sermon_date,
  } = req.body;

  if (!title_en || !title_fr || !title_sw || !speaker) {
    // Clean up the file we already saved, since we're rejecting this upload.
    fs.unlink(req.file.path, () => {});
    return res.status(400).json({ error: "Title (in all three languages) and speaker are required." });
  }

  const fileUrl = `/uploads/${req.file.filename}`;
  const fileType = req.file.mimetype.startsWith("video/") ? "video" : "audio";

  try {
    const result = await pool.query(
      `INSERT INTO sermons
        (title_en, title_fr, title_sw, speaker, description_en, description_fr, description_sw, sermon_date, file_url, file_type)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [
        title_en, title_fr, title_sw,
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
// the actual file on disk).
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

    // Clean up the file too, so deleted sermons don't pile up on disk.
    const filePath = `.${result.rows[0].file_url}`;
    fs.unlink(filePath, () => {});

    res.json({ success: true });
  } catch (err) {
    console.error("Failed to delete sermon:", err.message);
    res.status(500).json({ error: "Something went wrong." });
  }
};
