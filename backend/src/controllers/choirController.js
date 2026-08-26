// Handles the choir: the roster of singers, the practice sessions
// scheduled, and who actually showed up to each practice.

import { pool } from "../config/db.js";

// --- Choir roster ---

export const getChoirMembers = async (req, res) => {
  const { group } = req.query;

  try {
    const result = group
      ? await pool.query(
          "SELECT * FROM choir_members WHERE group_name = $1 ORDER BY name ASC",
          [group]
        )
      : await pool.query("SELECT * FROM choir_members ORDER BY name ASC");
    res.json(result.rows);
  } catch (err) {
    console.error("Failed to fetch choir members:", err.message);
    res.status(500).json({ error: "Something went wrong." });
  }
};

export const createChoirMember = async (req, res) => {
  const { name, whatsapp, group_name } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Name is required." });
  }

  try {
    const result = await pool.query(
      `INSERT INTO choir_members (name, whatsapp, group_name) VALUES ($1, $2, $3) RETURNING *`,
      [name, whatsapp || "", group_name || "central"]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Failed to add choir member:", err.message);
    res.status(500).json({ error: "Something went wrong." });
  }
};

export const deleteChoirMember = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM choir_members WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Choir member not found." });
    }

    res.json({ success: true });
  } catch (err) {
    console.error("Failed to delete choir member:", err.message);
    res.status(500).json({ error: "Something went wrong." });
  }
};

// --- Practice sessions ---

export const getSessions = async (req, res) => {
  const { group } = req.query;

  try {
    const result = group
      ? await pool.query(
          "SELECT * FROM choir_practice_sessions WHERE group_name = $1 ORDER BY session_date DESC",
          [group]
        )
      : await pool.query(
          "SELECT * FROM choir_practice_sessions ORDER BY session_date DESC"
        );
    res.json(result.rows);
  } catch (err) {
    console.error("Failed to fetch practice sessions:", err.message);
    res.status(500).json({ error: "Something went wrong." });
  }
};

export const createSession = async (req, res) => {
  const { session_date, notes, group_name } = req.body;

  if (!session_date) {
    return res.status(400).json({ error: "A date is required." });
  }

  try {
    const result = await pool.query(
      `INSERT INTO choir_practice_sessions (session_date, notes, group_name)
       VALUES ($1, $2, $3) RETURNING *`,
      [session_date, notes || "", group_name || "central"]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Failed to create practice session:", err.message);
    res.status(500).json({ error: "Something went wrong." });
  }
};

export const deleteSession = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM choir_practice_sessions WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Session not found." });
    }

    res.json({ success: true });
  } catch (err) {
    console.error("Failed to delete practice session:", err.message);
    res.status(500).json({ error: "Something went wrong." });
  }
};

// --- Attendance (who showed up to a given practice) ---

// Joins choir_members so the response includes each attendee's name,
// not just their id.
export const getAttendance = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `SELECT choir_attendance.id, choir_attendance.choir_member_id, choir_members.name
       FROM choir_attendance
       JOIN choir_members ON choir_members.id = choir_attendance.choir_member_id
       WHERE choir_attendance.session_id = $1
       ORDER BY choir_members.name ASC`,
      [id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Failed to fetch practice attendance:", err.message);
    res.status(500).json({ error: "Something went wrong." });
  }
};

export const addAttendance = async (req, res) => {
  const { id } = req.params;
  const { choir_member_id } = req.body;

  if (!choir_member_id) {
    return res.status(400).json({ error: "A choir member is required." });
  }

  try {
    const result = await pool.query(
      `INSERT INTO choir_attendance (session_id, choir_member_id)
       VALUES ($1, $2) RETURNING *`,
      [id, choir_member_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Failed to mark attendance:", err.message);
    res.status(500).json({ error: "Something went wrong." });
  }
};

export const removeAttendance = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM choir_attendance WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Attendance record not found." });
    }

    res.json({ success: true });
  } catch (err) {
    console.error("Failed to remove attendance:", err.message);
    res.status(500).json({ error: "Something went wrong." });
  }
};
