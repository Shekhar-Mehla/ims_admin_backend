import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter
  .verify()
  .then(() => console.log("Email transporter ready"))
  .catch((error) => console.error("Transporter error:", error));
