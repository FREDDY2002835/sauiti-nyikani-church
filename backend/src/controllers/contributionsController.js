// Handles church contribution records and fundraising projects.

import { pool } from "../config/db.js";

// GET /api/contributions
// Optional filters: ?year=2026&month=8
export const getContributions = async (req, res) => {
  const { year, month } = req.query;

  try {
    let query = `SELECT c.*, p.name AS project_name, p.project_year
                  FROM contributions c
                  LEFT JOIN contribution_projects p ON p.id = c.project_id`;
    const params = [];

    if (year && month) {
      params.push(year, month);
      query +=
        " WHERE EXTRACT(YEAR FROM c.contribution_date) = $1 AND EXTRACT(MONTH FROM c.contribution_date) = $2";
    } else if (year) {
      params.push(year);
      query +=
        " WHERE EXTRACT(YEAR FROM c.contribution_date) = $1";
    }

    query += " ORDER BY c.fulfilled ASC, c.contribution_date DESC, c.created_at DESC";

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error("Failed to fetch contributions:", err.message);
    res.status(500).json({ error: "Something went wrong." });
  }
};

export const createContribution = async (req, res) => {
  const { contributor_name, kind, amount, contribution_date, project_id } = req.body;

  if (!contributor_name || !amount || !contribution_date) {
    return res
      .status(400)
      .json({ error: "Name, amount, and date are all required." });
  }

  try {
    const result = await pool.query(
      `INSERT INTO contributions
        (contributor_name, kind, amount, contribution_date, fulfilled, project_id)
       VALUES ($1, $2, $3, $4, FALSE, $5)
       RETURNING *`,
      [
        contributor_name.trim(),
        kind || "",
        amount,
        contribution_date,
        project_id || null,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Failed to record contribution:", err.message);
    res.status(500).json({ error: "Something went wrong." });
  }
};

// PUT /api/contributions/:id/fulfill
// Toggle whether the contribution has actually been given.
export const toggleContributionFulfilled = async (req, res) => {
  const { id } = req.params;

  try {
    const current = await pool.query(
      "SELECT fulfilled FROM contributions WHERE id = $1",
      [id]
    );

    if (current.rows.length === 0) {
      return res.status(404).json({ error: "Contribution not found." });
    }

    const newState = !current.rows[0].fulfilled;

    const result = await pool.query(
      `UPDATE contributions
       SET fulfilled = $1, fulfilled_date = $2
       WHERE id = $3
       RETURNING *`,
      [
        newState,
        newState ? new Date().toISOString().slice(0, 10) : null,
        id,
      ]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Failed to update contribution:", err.message);
    res.status(500).json({ error: "Something went wrong." });
  }
};

export const deleteContribution = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM contributions WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Record not found." });
    }

    res.json({ success: true });
  } catch (err) {
    console.error("Failed to delete contribution record:", err.message);
    res.status(500).json({ error: "Something went wrong." });
  }
};

// --- Projects ---

export const getProjects = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        p.*,
        COALESCE(SUM(CASE WHEN c.fulfilled = TRUE THEN c.amount ELSE 0 END), 0) AS raised_amount
      FROM contribution_projects p
      LEFT JOIN contributions c ON c.project_id = p.id
      GROUP BY p.id
      ORDER BY p.project_year DESC, p.created_at DESC
    `);

    res.json(result.rows);
  } catch (err) {
    console.error("Failed to fetch projects:", err.message);
    res.status(500).json({ error: "Something went wrong." });
  }
};

export const createProject = async (req, res) => {
  const { name, goal_amount, project_year } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ error: "A project name is required." });
  }

  try {
    const result = await pool.query(
      `INSERT INTO contribution_projects (name, goal_amount, project_year)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [name.trim(), goal_amount || 0, project_year || new Date().getFullYear()]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Failed to create project:", err.message);
    res.status(500).json({ error: "Something went wrong." });
  }
};

export const deleteProject = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM contribution_projects WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Project not found." });
    }

    res.json({ success: true });
  } catch (err) {
    console.error("Failed to delete project:", err.message);
    res.status(500).json({ error: "Something went wrong." });
  }
};
