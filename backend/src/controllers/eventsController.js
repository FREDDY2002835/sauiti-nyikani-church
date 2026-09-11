// This file handles everything to do with the "events" table: listing
// upcoming events, and adding/editing/deleting them from the admin page.
//
// You only type content in English - French and Swahili are filled in
// automatically using a free translation service (see utils/translate.js).

import { pool } from "../config/db.js";
import { translateToFrenchAndSwahili } from "../utils/translate.js";

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

// POST /api/events - add a new event (English text in, auto-translated on the way in)
export const createEvent = async (req, res) => {
  const { title_en, description_en, location_en, event_date, event_time } = req.body;

  if (!title_en) {
    return res.status(400).json({ error: "A title is required." });
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
         location_en, location_fr, location_sw, event_date, event_time)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING *`,
      [
        title_en, titleTr.fr, titleTr.sw,
        description_en || "", descTr.fr, descTr.sw,
        location_en || "", locationTr.fr, locationTr.sw,
        event_date || null, event_time || "",
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Failed to create event:", err.message);
    res.status(500).json({ error: "Something went wrong." });
  }
};

// PUT /api/events/:id - edit an existing event (re-translates on every save)
export const updateEvent = async (req, res) => {
  const { id } = req.params;
  const { title_en, description_en, location_en, event_date, event_time } = req.body;

  if (!title_en) {
    return res.status(400).json({ error: "A title is required." });
  }

  try {
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
        event_date = $10, event_time = $11
       WHERE id = $12
       RETURNING *`,
      [
        title_en, titleTr.fr, titleTr.sw,
        description_en || "", descTr.fr, descTr.sw,
        location_en || "", locationTr.fr, locationTr.sw,
        event_date || null, event_time || "",
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Event not found." });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Failed to update event:", err.message);
    res.status(500).json({ error: "Something went wrong." });
  }
};

// DELETE /api/events/:id - remove an event
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

    res.json({ success: true });
  } catch (err) {
    console.error("Failed to delete event:", err.message);
    res.status(500).json({ error: "Something went wrong." });
  }
};
