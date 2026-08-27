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

// A ministry's name/description come in one language at a time from the
// admin form now (whichever language the site is currently set to), so
// this maps that language to the pair of columns it actually belongs to.
const LANGUAGE_COLUMNS = {
  en: ["name_en", "description_en"],
  fr: ["name_fr", "description_fr"],
  sw: ["name_sw", "description_sw"],
};

// POST /api/ministries - add a new ministry (in whichever ONE language
// the admin was using at the time - the other two languages are left
// blank until someone fills them in later, from the same form after
// switching the site's language)
export const createMinistry = async (req, res) => {
  const { language, name, description, leader_name, sort_order } = req.body;
  const columns = LANGUAGE_COLUMNS[language] || LANGUAGE_COLUMNS.en;
  const [nameColumn, descriptionColumn] = columns;

  if (!name || !description) {
    return res.status(400).json({ error: "Name and description are required." });
  }

  try {
    const result = await pool.query(
      `INSERT INTO ministries (${nameColumn}, ${descriptionColumn}, leader_name, sort_order)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [name, description, leader_name || "", sort_order || 0]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Failed to create ministry:", err.message);
    res.status(500).json({ error: "Something went wrong." });
  }
};

// PUT /api/ministries/:id - edit an existing ministry. Only the name/
// description for the ONE language sent gets updated - the other two
// languages' text is left exactly as it was, so switching the site to
// French and editing there doesn't erase the English or Swahili text.
export const updateMinistry = async (req, res) => {
  const { id } = req.params;
  const { language, name, description, leader_name, sort_order } = req.body;
  const columns = LANGUAGE_COLUMNS[language] || LANGUAGE_COLUMNS.en;
  const [nameColumn, descriptionColumn] = columns;

  if (!name || !description) {
    return res.status(400).json({ error: "Name and description are required." });
  }

  try {
    const result = await pool.query(
      `UPDATE ministries
       SET ${nameColumn} = $1, ${descriptionColumn} = $2,
           leader_name = $3, sort_order = $4
       WHERE id = $5
       RETURNING *`,
      [name, description, leader_name || "", sort_order || 0, id]
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
