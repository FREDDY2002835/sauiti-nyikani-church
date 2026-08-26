// Handles the extra details attached to a ministry: who belongs to it,
// what activities it runs, and what's planned - each is just a simple
// named list scoped to one ministry_id.

import { pool } from "../config/db.js";

// --- Members ---

export const getMembers = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM ministry_members WHERE ministry_id = $1 ORDER BY name ASC",
      [id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Failed to fetch ministry members:", err.message);
    res.status(500).json({ error: "Something went wrong." });
  }
};

export const addMember = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: "A name is required." });
  }

  try {
    const result = await pool.query(
      "INSERT INTO ministry_members (ministry_id, name) VALUES ($1, $2) RETURNING *",
      [id, name]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Failed to add ministry member:", err.message);
    res.status(500).json({ error: "Something went wrong." });
  }
};

export const deleteMember = async (req, res) => {
  const { memberId } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM ministry_members WHERE id = $1 RETURNING *",
      [memberId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Member not found." });
    }
    res.json({ success: true });
  } catch (err) {
    console.error("Failed to remove ministry member:", err.message);
    res.status(500).json({ error: "Something went wrong." });
  }
};

// --- Activities ---

export const getActivities = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM ministry_activities WHERE ministry_id = $1 ORDER BY created_at ASC",
      [id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Failed to fetch ministry activities:", err.message);
    res.status(500).json({ error: "Something went wrong." });
  }
};

export const addActivity = async (req, res) => {
  const { id } = req.params;
  const { description } = req.body;

  if (!description) {
    return res.status(400).json({ error: "A description is required." });
  }

  try {
    const result = await pool.query(
      "INSERT INTO ministry_activities (ministry_id, description) VALUES ($1, $2) RETURNING *",
      [id, description]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Failed to add ministry activity:", err.message);
    res.status(500).json({ error: "Something went wrong." });
  }
};

export const deleteActivity = async (req, res) => {
  const { activityId } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM ministry_activities WHERE id = $1 RETURNING *",
      [activityId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Activity not found." });
    }
    res.json({ success: true });
  } catch (err) {
    console.error("Failed to remove ministry activity:", err.message);
    res.status(500).json({ error: "Something went wrong." });
  }
};

// --- Plans ---

export const getPlans = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM ministry_plans WHERE ministry_id = $1 ORDER BY created_at ASC",
      [id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Failed to fetch ministry plans:", err.message);
    res.status(500).json({ error: "Something went wrong." });
  }
};

export const addPlan = async (req, res) => {
  const { id } = req.params;
  const { description } = req.body;

  if (!description) {
    return res.status(400).json({ error: "A description is required." });
  }

  try {
    const result = await pool.query(
      "INSERT INTO ministry_plans (ministry_id, description) VALUES ($1, $2) RETURNING *",
      [id, description]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Failed to add ministry plan:", err.message);
    res.status(500).json({ error: "Something went wrong." });
  }
};

export const deletePlan = async (req, res) => {
  const { planId } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM ministry_plans WHERE id = $1 RETURNING *",
      [planId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Plan not found." });
    }
    res.json({ success: true });
  } catch (err) {
    console.error("Failed to remove ministry plan:", err.message);
    res.status(500).json({ error: "Something went wrong." });
  }
};
