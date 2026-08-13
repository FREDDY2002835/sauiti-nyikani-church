// Same pattern as contactController.js, just for prayer requests instead.

import { pool } from "../config/db.js";
import { sendMail } from "../utils/mailer.js";

export const submitPrayer = async (req, res) => {
  const { name, email, request } = req.body;

  if (!name || !email || !request) {
    return res.status(400).json({ error: "Name, email, and prayer request are all required." });
  }

  try {
    const result = await pool.query(
      `INSERT INTO prayer_requests (name, email, request)
       VALUES ($1, $2, $3)
       RETURNING id, created_at`,
      [name, email, request]
    );

    // Passing "email" as the third argument means when you hit "Reply" in
    // your inbox, it goes to the person who submitted the request - not
    // back to your own church email address.
    await sendMail(
      `New Prayer Request from ${name}`,
      `Name: ${name}\nEmail: ${email}\n\nRequest:\n${request}`,
      email
    );

    res.status(201).json({
      success: true,
      id: result.rows[0].id,
    });
  } catch (err) {
    console.error("Prayer submission failed:", err.message);
    res.status(500).json({ error: "Something went wrong. Please try again later." });
  }
};
