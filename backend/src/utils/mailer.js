// This file sets up email sending. Both the contact form and the prayer form
// will call sendMail() so we only need to configure this once.

import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail", // change this if you use a different email provider
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Sends a simple notification email.
 * @param {string} subject - Email subject line
 * @param {string} text - Plain text body
 * @param {string} [replyTo] - Optional email address that "Reply" should go to
 *   (e.g. the form submitter's email), instead of replying back to yourself.
 */
export const sendMail = async (subject, text, replyTo) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_TO,
      replyTo,
      subject,
      text,
    });
  } catch (err) {
    // We log the error but don't crash the request - the form data is
    // already safely saved in the database even if email fails.
    console.error("Email failed to send:", err.message);
  }
};
