// Handles the "members" table - the church's contact directory.
// Names/addresses aren't translated (they're just names), but this
// feeds a UI that IS shown in all three languages.

import { pool } from "../config/db.js";

export const getMembers = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM members ORDER BY name ASC");
    res.json(result.rows);
  } catch (err) {
    console.error("Failed to fetch members:", err.message);
    res.status(500).json({ error: "Something went wrong." });
  }
};

export const createMember = async (req, res) => {
  const { name, whatsapp, email, address, status } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Name is required." });
  }

  try {
    const result = await pool.query(
      `INSERT INTO members (name, whatsapp, email, address, status)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [name, whatsapp || "", email || "", address || "", status || ""]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Failed to create member:", err.message);
    res.status(500).json({ error: "Something went wrong." });
  }
};

export const updateMember = async (req, res) => {
  const { id } = req.params;
  const { name, whatsapp, email, address, status } = req.body;

  try {
    const result = await pool.query(
      `UPDATE members SET name = $1, whatsapp = $2, email = $3, address = $4, status = $5
       WHERE id = $6 RETURNING *`,
      [name, whatsapp || "", email || "", address || "", status || "", id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Member not found." });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Failed to update member:", err.message);
    res.status(500).json({ error: "Something went wrong." });
  }
};

export const deleteMember = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM members WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Member not found." });
    }

    res.json({ success: true });
  } catch (err) {
    console.error("Failed to delete member:", err.message);
    res.status(500).json({ error: "Something went wrong." });
  }
};

// PUT /api/members/:id/testimony - save a member's testimony (ushuhuda)
// and life story. Kept separate from the main updateMember endpoint so
// the everyday "edit contact info" form doesn't need to touch this.
export const updateTestimony = async (req, res) => {
  const { id } = req.params;
  const { testimony, life_story } = req.body;

  try {
    const result = await pool.query(
      `UPDATE members SET testimony = $1, life_story = $2 WHERE id = $3 RETURNING *`,
      [testimony || "", life_story || "", id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Member not found." });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Failed to save testimony:", err.message);
    res.status(500).json({ error: "Something went wrong." });
  }
};
