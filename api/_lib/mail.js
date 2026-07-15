// Verstuurt systeemmails (bv. retentiemeldingen) via de SMTP-relay van Resend — los van
// Supabase Auth-mails (verificatie/magic-link), die apart via Supabase zelf lopen.

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.resend.com',
  port: 465,
  secure: true,
  auth: { user: 'resend', pass: process.env.RESEND_API_KEY },
});

async function sendMail(to, subject, html) {
  await transporter.sendMail({
    from: 'Webfinance <onboarding@resend.dev>',
    to,
    subject,
    html,
  });
}

module.exports = { sendMail };
