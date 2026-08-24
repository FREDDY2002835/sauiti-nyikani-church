// This file handles everything to do with the "gallery_images" table:
// listing photos, uploading a new one (with a captions in all three
// languages), editing captions, and deleting a photo.

import fs from "fs";
import { pool } from "../config/db.js";

// GET /api/gallery - list all photos, for the public Gallery page
export const getGalleryImages = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM gallery_images ORDER BY sort_order ASC, id DESC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Failed to fetch gallery images:", err.message);
    res.status(500).json({ error: "Something went wrong." });
  }
};

// POST /api/gallery - upload a new photo (multipart/form-data, handled
// by multer before this function runs - the file itself is in req.file,
// everything else is in req.body like a normal form).
export const uploadGalleryImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "An image file is required." });
  }

  const { caption_en, caption_fr, caption_sw, sort_order } = req.body;
  const imageUrl = `/uploads/${req.file.filename}`;

  try {
    const result = await pool.query(
      `INSERT INTO gallery_images
        (image_url, caption_en, caption_fr, caption_sw, sort_order)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [
        imageUrl,
        caption_en || "",
        caption_fr || "",
        caption_sw || "",
        sort_order || 0,
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Failed to save gallery image:", err.message);
    res.status(500).json({ error: "Something went wrong." });
  }
};

// PUT /api/gallery/:id - edit a photo's captions (not the image file
// itself - to replace the photo, delete it and upload a new one).
export const updateGalleryImage = async (req, res) => {
  const { id } = req.params;
  const { caption_en, caption_fr, caption_sw, sort_order } = req.body;

  try {
    const result = await pool.query(
      `UPDATE gallery_images
       SET caption_en = $1, caption_fr = $2, caption_sw = $3, sort_order = $4
       WHERE id = $5
       RETURNING *`,
      [caption_en || "", caption_fr || "", caption_sw || "", sort_order || 0, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Photo not found." });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Failed to update gallery image:", err.message);
    res.status(500).json({ error: "Something went wrong." });
  }
};

// DELETE /api/gallery/:id - remove a photo (both the database row and
// the actual file on disk).
export const deleteGalleryImage = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM gallery_images WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Photo not found." });
    }

    // Clean up the file too, so deleted photos don't pile up on disk.
    // If the file's already gone for some reason, that's fine - ignore it.
    const filePath = `.${result.rows[0].image_url}`;
    fs.unlink(filePath, () => {});

    res.json({ success: true });
  } catch (err) {
    console.error("Failed to delete gallery image:", err.message);
    res.status(500).json({ error: "Something went wrong." });
  }
};
