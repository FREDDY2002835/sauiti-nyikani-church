import { pool } from "../config/db.js";

export const getAnnouncements = async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM announcements ORDER BY announcement_date DESC, created_at DESC`);
    res.json(result.rows);
  } catch (err) {
    console.error("Failed to fetch announcements:", err.message);
    res.status(500).json({ error: "Something went wrong." });
  }
};

export const createAnnouncement = async (req, res) => {
  const { title, message, announcement_date } = req.body;
  if (!title?.trim() || !message?.trim() || !announcement_date) {
    return res.status(400).json({ error: "Title, message, and date are required." });
  }
  try {
    const result = await pool.query(
      `INSERT INTO announcements (title, message, announcement_date) VALUES ($1, $2, $3) RETURNING *`,
      [title.trim(), message.trim(), announcement_date]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Failed to create announcement:", err.message);
    res.status(500).json({ error: "Something went wrong." });
  }
};

export const updateAnnouncement = async (req, res) => {
  const { id } = req.params;
  const { title, message, announcement_date } = req.body;
  if (!title?.trim() || !message?.trim() || !announcement_date) {
    return res.status(400).json({ error: "Title, message, and date are required." });
  }
  try {
    const result = await pool.query(
      `UPDATE announcements SET title=$1, message=$2, announcement_date=$3 WHERE id=$4 RETURNING *`,
      [title.trim(), message.trim(), announcement_date, id]
    );
    if (!result.rows.length) return res.status(404).json({ error: "Announcement not found." });
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Failed to update announcement:", err.message);
    res.status(500).json({ error: "Something went wrong." });
  }
};

export const deleteAnnouncement = async (req, res) => {
  try {
    const result = await pool.query(`DELETE FROM announcements WHERE id=$1 RETURNING id`, [req.params.id]);
    if (!result.rows.length) return res.status(404).json({ error: "Announcement not found." });
    res.json({ success: true });
  } catch (err) {
    console.error("Failed to delete announcement:", err.message);
    res.status(500).json({ error: "Something went wrong." });
  }
};
