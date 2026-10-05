// This file handles everything to do with the "events" table: listing
// upcoming events, and adding/editing/deleting them from the admin page.
//
// You only type content in English - French and Swahili are filled in
// automatically using a free translation service (see utils/translate.js).
//
// Event posters are stored on Cloudinary (permanent); only the link is kept
// in the database.

import fs from "fs";
import { pool } from "../config/db.js";
import cloudinary from "../config/cloudinary.js";
import { translateToFrenchAndSwahili } from "../utils/translate.js";

// Sends the poster (held in memory by multer) to Cloudinary and waits for the
// result. The picture is stored exactly as uploaded - no cropping or resizing.
const uploadToCloudinary = (buffer) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "sauti-nyikani/events", resource_type: "image" },
      (error, result) => (error ? reject(error) : resolve(result))
    );
    stream.end(buffer);
  });

// Turns a Cloudinary link back into its "public id" so we can delete it.
// .../upload/v123/sauti-nyikani/events/abc.jpg -> sauti-nyikani/events/abc
const getPublicId = (url) => {
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-zA-Z0-9]+$/);
  return match ? match[1] : null;
};

// Removes an old poster. New posters live on Cloudinary; older ones (from
// before the switch) pointed at this server's disk, where they are usually
// already gone.
const removeImage = (imageUrl) => {
  if (!imageUrl) return;
  if (imageUrl.startsWith("http")) {
    const publicId = getPublicId(imageUrl);
    if (publicId) cloudinary.uploader.destroy(publicId).catch(() => {});
  } else {
    fs.unlink(`.${imageUrl}`, () => {});
  }
};

// GET /api/events - list all events, for the public Events page
export const getEvents = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM events ORDER BY event_date ASC NULLS LAST, id ASC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Failed to fetch events:", err.message);
    res.status(500).json({ error: "Something went wrong." });
  }
};

// POST /api/events - add a new event (English text in, auto-translated on
// the way in). The poster image is optional - if none is uploaded, the
// event just has no image, that's fine.
export const createEvent = async (req, res) => {
  const { title_en, description_en, location_en, event_date, event_time } = req.body;

  if (!title_en) {
    return res.status(400).json({ error: "A title is required." });
  }

  let imageUrl = "";
  if (req.file) {
    try {
      const uploaded = await uploadToCloudinary(req.file.buffer);
      imageUrl = uploaded.secure_url; // full https link, stored in the database
    } catch (err) {
      console.error("Cloudinary event image upload failed:", err.message);
      return res.status(502).json({ error: "Could not upload the image. Please try again." });
    }
  }

  try {
    const [titleTr, descTr, locationTr] = await Promise.all([
      translateToFrenchAndSwahili(title_en),
      translateToFrenchAndSwahili(description_en || ""),
      translateToFrenchAndSwahili(location_en || ""),
    ]);

    const result = await pool.query(
      `INSERT INTO events
        (title_en, title_fr, title_sw, description_en, description_fr, description_sw,
         location_en, location_fr, location_sw, event_date, event_time, image_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
       RETURNING *`,
      [
        title_en, titleTr.fr, titleTr.sw,
        description_en || "", descTr.fr, descTr.sw,
        location_en || "", locationTr.fr, locationTr.sw,
        event_date || null, event_time || "", imageUrl,
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    // The event could not be saved, so don't leave an orphan picture behind.
    removeImage(imageUrl);
    console.error("Failed to create event:", err.message);
    res.status(500).json({ error: "Something went wrong." });
  }
};

// PUT /api/events/:id - edit an existing event (re-translates on every
// save). If a new image is uploaded it replaces the old one; if not,
// whatever image the event already had (or didn't have) stays as-is.
export const updateEvent = async (req, res) => {
  const { id } = req.params;
  const { title_en, description_en, location_en, event_date, event_time } = req.body;

  if (!title_en) {
    return res.status(400).json({ error: "A title is required." });
  }

  try {
    const existing = await pool.query("SELECT image_url FROM events WHERE id = $1", [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ error: "Event not found." });
    }
    const oldImageUrl = existing.rows[0].image_url;

    let imageUrl = oldImageUrl;
    let uploadedNew = false;
    if (req.file) {
      try {
        const uploaded = await uploadToCloudinary(req.file.buffer);
        imageUrl = uploaded.secure_url;
        uploadedNew = true;
      } catch (err) {
        console.error("Cloudinary event image upload failed:", err.message);
        return res.status(502).json({ error: "Could not upload the image. Please try again." });
      }
    }

    const [titleTr, descTr, locationTr] = await Promise.all([
      translateToFrenchAndSwahili(title_en),
      translateToFrenchAndSwahili(description_en || ""),
      translateToFrenchAndSwahili(location_en || ""),
    ]);

    const result = await pool.query(
      `UPDATE events SET
        title_en = $1, title_fr = $2, title_sw = $3,
        description_en = $4, description_fr = $5, description_sw = $6,
        location_en = $7, location_fr = $8, location_sw = $9,
        event_date = $10, event_time = $11, image_url = $12
       WHERE id = $13
       RETURNING *`,
      [
        title_en, titleTr.fr, titleTr.sw,
        description_en || "", descTr.fr, descTr.sw,
        location_en || "", locationTr.fr, locationTr.sw,
        event_date || null, event_time || "", imageUrl,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Event not found." });
    }

    // The new poster replaced the old one, so the old one can be deleted.
    if (uploadedNew) removeImage(oldImageUrl);

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Failed to update event:", err.message);
    res.status(500).json({ error: "Something went wrong." });
  }
};

// DELETE /api/events/:id - remove an event (the database row and its poster)
export const deleteEvent = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM events WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Event not found." });
    }

    removeImage(result.rows[0].image_url);

    res.json({ success: true });
  } catch (err) {
    console.error("Failed to delete event:", err.message);
    res.status(500).json({ error: "Something went wrong." });
  }
};