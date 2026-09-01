// Handles the Church Elders' Council (Baraza / Comité des Anciens):
// the roster of elders, the meetings held, who attended each one, and
// the council's ongoing plans.

import { pool } from "../config/db.js";

// --- Elders roster ---

export const getElders = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM elders ORDER BY name ASC");
    res.json(result.rows);
  } catch (err) {
    console.error("Failed to fetch elders:", err.message);
    res.status(500).json({ error: "Something went wrong." });
  }
};

export const createElder = async (req, res) => {
  const { name, whatsapp } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Name is required." });
  }

  try {
    const result = await pool.query(
      "INSERT INTO elders (name, whatsapp) VALUES ($1, $2) RETURNING *",
      [name, whatsapp || ""]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Failed to add elder:", err.message);
    res.status(500).json({ error: "Something went wrong." });
  }
};

export const deleteElder = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM elders WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Elder not found." });
    }
    res.json({ success: true });
  } catch (err) {
    console.error("Failed to remove elder:", err.message);
    res.status(500).json({ error: "Something went wrong." });
  }
};

// --- Meetings ---

export const getMeetings = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM elder_meetings ORDER BY meeting_date DESC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Failed to fetch elder meetings:", err.message);
    res.status(500).json({ error: "Something went wrong." });
  }
};

export const createMeeting = async (req, res) => {
  const { meeting_date, notes } = req.body;

  if (!meeting_date) {
    return res.status(400).json({ error: "A date is required." });
  }

  try {
    const result = await pool.query(
      `INSERT INTO elder_meetings (meeting_date, notes) VALUES ($1, $2) RETURNING *`,
      [meeting_date, notes || ""]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Failed to create elder meeting:", err.message);
    res.status(500).json({ error: "Something went wrong." });
  }
};

export const deleteMeeting = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM elder_meetings WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Meeting not found." });
    }
    res.json({ success: true });
  } catch (err) {
    console.error("Failed to delete elder meeting:", err.message);
    res.status(500).json({ error: "Something went wrong." });
  }
};

// PUT /api/elders/meetings/:id/minutes - save the full write-up of
// everything discussed in a meeting (separate from the short "notes"
// field set when the meeting was first scheduled).
export const updateMeetingMinutes = async (req, res) => {
  const { id } = req.params;
  const { minutes } = req.body;

  try {
    const result = await pool.query(
      "UPDATE elder_meetings SET minutes = $1 WHERE id = $2 RETURNING *",
      [minutes || "", id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Meeting not found." });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Failed to save meeting minutes:", err.message);
    res.status(500).json({ error: "Something went wrong." });
  }
};

// --- Attendance ---

// Joins the elders table so the response includes each attendee's
// name, not just their id.
export const getAttendance = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `SELECT elder_meeting_attendance.id, elder_meeting_attendance.elder_id, elders.name
       FROM elder_meeting_attendance
       JOIN elders ON elders.id = elder_meeting_attendance.elder_id
       WHERE elder_meeting_attendance.meeting_id = $1
       ORDER BY elders.name ASC`,
      [id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Failed to fetch meeting attendance:", err.message);
    res.status(500).json({ error: "Something went wrong." });
  }
};

export const addAttendance = async (req, res) => {
  const { id } = req.params;
  const { elder_id } = req.body;

  if (!elder_id) {
    return res.status(400).json({ error: "An elder is required." });
  }

  try {
    const result = await pool.query(
      `INSERT INTO elder_meeting_attendance (meeting_id, elder_id) VALUES ($1, $2) RETURNING *`,
      [id, elder_id]
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
      "DELETE FROM elder_meeting_attendance WHERE id = $1 RETURNING *",
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

// --- Plans (things the council has decided or is planning) ---

export const getPlans = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM elder_plans ORDER BY created_at ASC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Failed to fetch elder plans:", err.message);
    res.status(500).json({ error: "Something went wrong." });
  }
};

export const addPlan = async (req, res) => {
  const { description } = req.body;

  if (!description) {
    return res.status(400).json({ error: "A description is required." });
  }

  try {
    const result = await pool.query(
      "INSERT INTO elder_plans (description) VALUES ($1) RETURNING *",
      [description]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Failed to add elder plan:", err.message);
    res.status(500).json({ error: "Something went wrong." });
  }
};

export const deletePlan = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM elder_plans WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Plan not found." });
    }
    res.json({ success: true });
  } catch (err) {
    console.error("Failed to delete elder plan:", err.message);
    res.status(500).json({ error: "Something went wrong." });
  }
};
