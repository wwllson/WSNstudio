/* ============================================================
   WSN — mailer
   Builds the SMTP transporter (Hostinger) and sends contact-form
   enquiries. Kept separate from server.js so "send mail" and
   "run the web server" are independent concerns.

   Calls dotenv.config() itself (not just relying on server.js
   having called it): in ESM, an imported module's top-level code
   runs before the importing file's own statements, so if this
   file read process.env without loading .env first, the
   transporter could be built with undefined credentials.
   ============================================================ */
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 465),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

var requiredSmtpVars = ["SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS"];
var missingSmtpVars = requiredSmtpVars.filter(function (key) { return !process.env[key]; });
if (missingSmtpVars.length) {
  console.warn("Warning: missing SMTP config in .env: " + missingSmtpVars.join(", ") + " — /api/contact will fail until this is set.");
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* sendContactEmail — message/business/interest are optional, matching the
   form: only name + email are ever required to send (server.js's route
   also requires business for a valid submission, but that's a UX rule,
   not a mail-sending one, so it isn't duplicated in here). */
async function sendContactEmail({ name, business, email, interest, message }) {
  if (!name || !email) {
    throw new Error("Name and email are required");
  }

  return transporter.sendMail({
    from: `"WSN website" <${process.env.SMTP_USER}>`,
    to: process.env.CONTACT_TO,
    replyTo: email,
    subject: `New website enquiry from ${name}`,
    text: `
New enquiry from the WSN website

Name: ${name}
Business: ${business || "Not provided"}
Email: ${email}
Interested in: ${interest || "Not provided"}

Message:
${message || "Not provided"}
    `,
    html: `
      <h2>New enquiry from the WSN website</h2>
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>Business:</strong> ${escapeHtml(business || "Not provided")}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>Interested in:</strong> ${escapeHtml(interest || "Not provided")}</p>
      <p><strong>Message:</strong></p>
      <p>${escapeHtml(message || "Not provided").replace(/\n/g, "<br>")}</p>
    `,
  });
}

export default sendContactEmail;
