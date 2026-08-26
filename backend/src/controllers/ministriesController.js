// This file handles everything to do with the "ministries" table:
// listing them, getting one specific ministry, and adding/editing/
// deleting them (for the admin page).
//
// Each ministry now stores its name and description in THREE languages
// (English, French, Swahili) - that's why you'll see _en / _fr / _sw
// on every field below.

import { pool } from "../config/db.js";

// GET /api/ministries - list all of them, for the public Ministries page
export const getMinistries = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM ministries ORDER BY sort_order ASC, id ASC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Failed to fetch ministries:", err.message);
    res.status(500).json({ error: "Something went wrong." });
  }
};

// GET /api/ministries/:id - one specific ministry, for the detail page
export const getMinistryById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query("SELECT * FROM ministries WHERE id = $1", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Ministry not found." });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Failed to fetch ministry:", err.message);
    res.status(500).json({ error: "Something went wrong." });
  }
};

// POST /api/ministries - add a new ministry
export const createMinistry = async (req, res) => {
  const {
    name_en, description_en,
    name_fr, description_fr,
    name_sw, description_sw,
    leader_name, sort_order,
  } = req.body;

  if (!name_en || !description_en || !name_fr || !description_fr || !name_sw || !description_sw) {
    return res.status(400).json({ error: "Name and description are required in all three languages." });
  }

  try {
    const result = await pool.query(
      `INSERT INTO ministries
        (name_en, description_en, name_fr, description_fr, name_sw, description_sw, leader_name, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [name_en, description_en, name_fr, description_fr, name_sw, description_sw, leader_name || "", sort_order || 0]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Failed to create ministry:", err.message);
    res.status(500).json({ error: "Something went wrong." });
  }
};

// PUT /api/ministries/:id - edit an existing ministry
export const updateMinistry = async (req, res) => {
  const { id } = req.params;
  const {
    name_en, description_en,
    name_fr, description_fr,
    name_sw, description_sw,
    leader_name, sort_order,
  } = req.body;

  if (!name_en || !description_en || !name_fr || !description_fr || !name_sw || !description_sw) {
    return res.status(400).json({ error: "Name and description are required in all three languages." });
  }

  try {
    const result = await pool.query(
      `UPDATE ministries
       SET name_en = $1, description_en = $2,
           name_fr = $3, description_fr = $4,
           name_sw = $5, description_sw = $6,
           leader_name = $7, sort_order = $8
       WHERE id = $9
       RETURNING *`,
      [name_en, description_en, name_fr, description_fr, name_sw, description_sw, leader_name || "", sort_order || 0, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Ministry not found." });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Failed to update ministry:", err.message);
    res.status(500).json({ error: "Something went wrong." });
  }
};

// DELETE /api/ministries/:id - remove a ministry
export const deleteMinistry = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM ministries WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Ministry not found." });
    }

    res.json({ success: true });
  } catch (err) {
    console.error("Failed to delete ministry:", err.message);
    res.status(500).json({ error: "Something went wrong." });
  }
};
