// Handles Holy Communion record-keeping: each "session" is one Communion
// day, and each session has a list of members who took part that day.

import { pool } from "../config/db.js";

// GET /api/communion/sessions - list every Communion day, most recent first
export const getSessions = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM communion_sessions ORDER BY session_date DESC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Failed to fetch communion sessions:", err.message);
    res.status(500).json({ error: "Something went wrong." });
  }
};

// POST /api/communion/sessions - schedule a new Communion day
export const createSession = async (req, res) => {
  const { session_date, notes } = req.body;

  if (!session_date) {
    return res.status(400).json({ error: "A date is required." });
  }

  try {
    const result = await pool.query(
      `INSERT INTO communion_sessions (session_date, notes)
       VALUES ($1, $2) RETURNING *`,
      [session_date, notes || ""]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Failed to create communion session:", err.message);
    res.status(500).json({ error: "Something went wrong." });
  }
};

// DELETE /api/communion/sessions/:id - also removes its attendance
// records automatically (ON DELETE CASCADE in the table definition)
export const deleteSession = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM communion_sessions WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Session not found." });
    }

    res.json({ success: true });
  } catch (err) {
    console.error("Failed to delete communion session:", err.message);
    res.status(500).json({ error: "Something went wrong." });
  }
};

// GET /api/communion/sessions/:id/attendance - who took part in this session
export const getAttendance = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "SELECT * FROM communion_attendance WHERE session_id = $1 ORDER BY member_name ASC",
      [id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Failed to fetch communion attendance:", err.message);
    res.status(500).json({ error: "Something went wrong." });
  }
};

// POST /api/communion/sessions/:id/attendance - add a person to this session
export const addAttendance = async (req, res) => {
  const { id } = req.params;
  const { member_name } = req.body;

  if (!member_name) {
    return res.status(400).json({ error: "A name is required." });
  }

  try {
    const result = await pool.query(
      `INSERT INTO communion_attendance (session_id, member_name)
       VALUES ($1, $2) RETURNING *`,
      [id, member_name]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Failed to add communion attendance:", err.message);
    res.status(500).json({ error: "Something went wrong." });
  }
};

// DELETE /api/communion/attendance/:id - remove one person from a session
export const removeAttendance = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM communion_attendance WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Attendance record not found." });
    }

    res.json({ success: true });
  } catch (err) {
    console.error("Failed to remove communion attendance:", err.message);
    res.status(500).json({ error: "Something went wrong." });
  }
};
