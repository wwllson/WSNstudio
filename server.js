/* ============================================================
   WSN — static site + contact-form mail server (Express)
   Serves the public site files and exposes POST /api/contact.
   Mail-sending logic (transporter, sendContactEmail) lives in
   mailer.js — this file only handles HTTP concerns.
   ============================================================ */
import express from "express";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import sendContactEmail, { EMAIL_RE } from "./mailer.js";

dotenv.config();

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: "20kb" })); // a contact form never needs more than this
app.use(express.urlencoded({ extended: true, limit: "20kb" }));

/* ------------------------------------------------------------
   Static files — explicit allowlist only.
   This directory also holds .env, server.js, mailer.js,
   package.json, node_modules, etc. Pointing express.static at
   the project root would serve those over HTTP, so only the
   files actually meant to be public are registered; everything
   else 404s.
   ------------------------------------------------------------ */
var PUBLIC_FILES = ["index.html", "404.html", "styles.css", "app.js", "robots.txt", "sitemap.xml"];
app.get("/", function (req, res) {
  res.sendFile(path.join(ROOT, "index.html"));
});
PUBLIC_FILES.forEach(function (file) {
  app.get("/" + file, function (req, res) {
    res.sendFile(path.join(ROOT, file));
  });
});
app.use("/brand", express.static(path.join(ROOT, "brand")));

/* ------------------------------------------------------------
   POST /api/contact
   ------------------------------------------------------------ */
app.post("/api/contact", async (req, res) => {
  try {
    const body = req.body || {};
    const name = (body.name || "").toString().trim();
    const business = (body.business || "").toString().trim();
    const email = (body.email || "").toString().trim();
    const interest = (body.interest || "").toString().trim();
    const message = (body.message || "").toString().trim();

    // Only name + email are required — message/business are optional, matching
    // sendContactEmail and the form itself (no "required" attribute on either).
    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: "Please complete your name and email.",
      });
    }
    // Reject header-injection attempts and malformed addresses up front
    if (/[\r\n]/.test(email) || !EMAIL_RE.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
      });
    }

    const to = process.env.CONTACT_TO;
    if (!to || to.indexOf("REPLACE_WITH") === 0) {
      console.error("CONTACT_TO is not configured in .env yet.");
      return res.status(500).json({
        success: false,
        message: "Sorry — the contact form isn’t set up to receive enquiries yet.",
      });
    }

    await sendContactEmail({ name, business, email, interest, message });

    return res.status(200).json({
      success: true,
      message: "Thanks, your message has been sent.",
    });
  } catch (error) {
    console.error("Contact form email error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again.",
    });
  }
});

/* ------------------------------------------------------------
   404 — anything not explicitly registered above (including
   .env, server.js, package.json, node_modules, backups, etc.)
   ------------------------------------------------------------ */
app.use(function (req, res) {
  res.status(404).sendFile(path.join(ROOT, "404.html"), function (err) {
    if (err) res.status(404).send("Not found");
  });
});

app.listen(PORT, function () {
  console.log("WSN site running at http://localhost:" + PORT);
});
