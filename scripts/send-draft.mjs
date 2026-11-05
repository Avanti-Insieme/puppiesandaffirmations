// Emails the batch summary and a link to the pull request for approval.
import fs from 'node:fs';
import nodemailer from 'nodemailer';

const user = process.env.GMAIL_USER || 'elkenojones@gmail.com';
const to = process.env.DRAFT_TO || user;
const summary = fs.readFileSync(process.env.SUMMARY_PATH, 'utf8');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user, pass: process.env.GMAIL_APP_PASSWORD },
});

await transporter.sendMail({
  from: user,
  to,
  subject: 'Puppies & Affirmations: new batch ready for review',
  text:
    `A new batch of posts is ready.\n\n` +
    `Approve it by merging this pull request:\n${process.env.PR_URL}\n\n` +
    `${summary}`,
});

console.log(`Draft sent to ${to}`);
