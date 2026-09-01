// Handles the Baptism Register (Kitabu cha Ubatizo): who was baptized,
// how, and when.

import { pool } from "../config/db.js";

// GET /api/baptisms - list all records, optionally filtered by
// ?year=2026 for a specific year
export const getBaptisms = async (req, res) => {
  const { year } = req.query;

  try {
    const result = year
      ? await pool.query(
          "SELECT * FROM baptisms WHERE EXTRACT(YEAR FROM baptism_date) = $1 ORDER BY baptism_date DESC",
          [year]
        )
      : await pool.query("SELECT * FROM baptisms ORDER BY baptism_date DESC");
    res.json(result.rows);
  } catch (err) {
    console.error("Failed to fetch baptisms:", err.message);
    res.status(500).json({ error: "Something went wrong." });
  }
};

export const createBaptism = async (req, res) => {
  const { member_name, method, baptism_date } = req.body;

  if (!member_name || !baptism_date) {
    return res.status(400).json({ error: "Name and date are required." });
  }

  try {
    const result = await pool.query(
      `INSERT INTO baptisms (member_name, method, baptism_date)
       VALUES ($1, $2, $3) RETURNING *`,
      [member_name, method || "", baptism_date]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Failed to record baptism:", err.message);
    res.status(500).json({ error: "Something went wrong." });
  }
};

export const deleteBaptism = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM baptisms WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Record not found." });
    }
    res.json({ success: true });
  } catch (err) {
    console.error("Failed to delete baptism record:", err.message);
    res.status(500).json({ error: "Something went wrong." });
  }
};
