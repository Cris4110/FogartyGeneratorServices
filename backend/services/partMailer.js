import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { partHtmlEmail } from '../templates/partEmail.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

console.log("MAIL_HOST check:", process.env.MAIL_HOST);

// Creates the transporter
const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: true,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

// To deploy change to: "admin@yourcompany.com" to real email
const sendAdminNotification = async (clientData) => {
  const mailOptions = {
  from: "Part Requests Admin",
  to: "testing404nf@gmail.com",
  subject: `New Part Request: ${clientData.partName}`,
  html: partHtmlEmail(clientData),
};

  try {
    console.log("Attempting to send email with these options:", mailOptions);
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent to Mailtrap: %s", info.messageId);
    return info;
  } catch (error) {
    console.error("DETAILED ERROR:", error); 
    throw error;
  }
};

export { sendAdminNotification };

