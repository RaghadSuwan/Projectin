import nodemailer from "nodemailer";

export async function sendemail(to, subject, html) {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
      user: process.env.EMAILSENDER,
      pass: process.env.EMAILPASSWORD,
    },
  });
  const info = await transporter.sendMail({
    from: `R-Store <${process.env.EMAILSENDER}>`,
    to,
    subject,
    html,
  });
  return info;
};