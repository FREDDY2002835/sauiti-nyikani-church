// This file contains the actual logic for what happens when someone
// submits the Contact form on the website.

import { pool } from "../config/db.js";
import { sendMail } from "../utils/mailer.js";

export const submitContact = async (req, res) => {
  const { name, email, message } = req.body;

  // --- 1. Basic validation ---
  // Never trust data coming from the browser - always check it server-side too,
  // even if the frontend form already has "required" on its inputs.
  if (!name || !email || !message) {
    return res.status(400).json({ error: "Name, email, and message are all required." });
  }

  try {
    // --- 2. Save to the database ---
    const result = await pool.query(
      `INSERT INTO contact_messages (name, email, message)
       VALUES ($1, $2, $3)
       RETURNING id, created_at`,
      [name, email, message]
    );

    // --- 3. Email the church office a copy ---
    // Passing "email" as the third argument means when you hit "Reply" in
    // your inbox, it goes to the person who submitted the form - not back
    // to your own church email address.
    await sendMail(
      `New Contact Message from ${name}`,
      `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      email
    );

    // --- 4. Tell the frontend it worked ---
    res.status(201).json({
      success: true,
      id: result.rows[0].id,
    });
  } catch (err) {
    console.error("Contact submission failed:", err.message);
    res.status(500).json({ error: "Something went wrong. Please try again later." });
  }
};