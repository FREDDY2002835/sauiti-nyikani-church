// Handles tithe payment records - who gave, how much, and on what date.

import { pool } from "../config/db.js";

// GET /api/tithes - list all payments, optionally filtered by
// ?year=2026&month=8 (month is 1-12) for a specific month's records
export const getTithes = async (req, res) => {
  const { year, month } = req.query;

  try {
    let query = "SELECT * FROM tithes";
    const params = [];

    if (year && month) {
      params.push(year, month);
      query +=
        " WHERE EXTRACT(YEAR FROM payment_date) = $1 AND EXTRACT(MONTH FROM payment_date) = $2";
    } else if (year) {
      params.push(year);
      query += " WHERE EXTRACT(YEAR FROM payment_date) = $1";
    }

    query += " ORDER BY payment_date DESC";

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error("Failed to fetch tithes:", err.message);
    res.status(500).json({ error: "Something went wrong." });
  }
};

export const createTithe = async (req, res) => {
  const { member_name, amount, payment_date } = req.body;

  if (!member_name || !amount || !payment_date) {
    return res
      .status(400)
      .json({ error: "Name, amount, and date are all required." });
  }

  try {
    const result = await pool.query(
      `INSERT INTO tithes (member_name, amount, payment_date)
       VALUES ($1, $2, $3) RETURNING *`,
      [member_name, amount, payment_date]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Failed to record tithe:", err.message);
    res.status(500).json({ error: "Something went wrong." });
  }
};

export const deleteTithe = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM tithes WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Record not found." });
    }

    res.json({ success: true });
  } catch (err) {
    console.error("Failed to delete tithe record:", err.message);
    res.status(500).json({ error: "Something went wrong." });
  }
};
