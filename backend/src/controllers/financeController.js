// Handles the church's cash box (Caisse): every entrance (income) and
// exit (expense) of money, so leadership can see what came in, what
// went out, and the running balance.

import { pool } from "../config/db.js";

// GET /api/finance - list transactions, optionally filtered by
// ?year=2026&month=8 (month is 1-12) for a specific month's records
export const getTransactions = async (req, res) => {
  const { year, month } = req.query;

  try {
    let query = "SELECT * FROM finance_transactions";
    const params = [];

    if (year && month) {
      params.push(year, month);
      query +=
        " WHERE EXTRACT(YEAR FROM transaction_date) = $1 AND EXTRACT(MONTH FROM transaction_date) = $2";
    } else if (year) {
      params.push(year);
      query += " WHERE EXTRACT(YEAR FROM transaction_date) = $1";
    }

    query += " ORDER BY transaction_date DESC, id DESC";

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error("Failed to fetch finance transactions:", err.message);
    res.status(500).json({ error: "Something went wrong." });
  }
};

export const createTransaction = async (req, res) => {
  const { type, amount, description, transaction_date } = req.body;

  if (!["in", "out"].includes(type) || !amount || !transaction_date) {
    return res.status(400).json({ error: "Type, amount, and date are all required." });
  }

  try {
    const result = await pool.query(
      `INSERT INTO finance_transactions (type, amount, description, transaction_date)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [type, amount, description || "", transaction_date]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Failed to record transaction:", err.message);
    res.status(500).json({ error: "Something went wrong." });
  }
};

export const deleteTransaction = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM finance_transactions WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Record not found." });
    }
    res.json({ success: true });
  } catch (err) {
    console.error("Failed to delete transaction:", err.message);
    res.status(500).json({ error: "Something went wrong." });
  }
};
