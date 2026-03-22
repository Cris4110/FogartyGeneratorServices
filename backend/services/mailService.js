import nodemailer from "nodemailer";

// Mailtrap transporter
const transporter = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 587,
  auth: {
    user: "mailtrap_user", // replace with your Mailtrap username
    pass: "mailtrap_pass", // replace with your Mailtrap password
  },
});

export const sendEmaill = async ({ to, subject, html }) => {
  try {
    const info = await transporter.sendMail({
      from: '"Test App" <test@example.com>',
      to,
      subject,
      html,
    });
    console.log("Email sent! ID:", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};