// This file sets up email sending. Both the contact form and the prayer form
// call sendMail() so we only need to configure this once.
//
// Why two methods?
// - Render's free plan BLOCKS SMTP ports (25, 465, 587), so Gmail/SMTP cannot
//   work there. On Render we send through the Resend HTTP API instead.
// - On your own computer (no RESEND_API_KEY set) it falls back to Gmail SMTP,
//   exactly like before.

import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// ---------- Option 1: Resend (HTTPS - works on Render free tier) ----------
const sendWithResend = async (subject, text, replyTo) => {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      // Until you verify your own domain in Resend, this sender must be
      // onboarding@resend.dev, and mail can only be delivered to the email
      // address you used to create the Resend account.
      from: process.env.RESEND_FROM || "Sauti Nyikani <onboarding@resend.dev>",
      to: [process.env.EMAIL_TO],
      reply_to: replyTo,
      subject,
      text,
    }),
    signal: AbortSignal.timeout(10000), // never hang the form for more than 10s
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Resend error ${response.status}: ${body}`);
  }
};

// ---------- Option 2: Gmail SMTP (local development only) ----------
const sendWithSmtp = async (subject, text, replyTo) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000,
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_TO,
    replyTo,
    subject,
    text,
  });
};

/**
 * Sends a simple notification email.
 * @param {string} subject - Email subject line
 * @param {string} text - Plain text body
 * @param {string} [replyTo] - Optional email address that "Reply" should go to
 *   (e.g. the form submitter's email), instead of replying back to yourself.
 */
export const sendMail = async (subject, text, replyTo) => {
  try {
    if (process.env.RESEND_API_KEY) {
      await sendWithResend(subject, text, replyTo);
    } else {
      await sendWithSmtp(subject, text, replyTo);
    }
    console.log("Email sent:", subject);
  } catch (err) {
    // We log the error but don't crash the request - the form data is
    // already safely saved in the database even if email fails.
    console.error("Email failed to send:", err.message);
  }
};