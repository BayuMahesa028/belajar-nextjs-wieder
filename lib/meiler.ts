// lib/mailer.ts
import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "EMAIL_KAMU@gmail.com",
    pass: "APP_PASSWORD", // bukan password gmail biasa
  },
});

export const sendOTP = async (email: string, kode: string) => {
  await transporter.sendMail({
    from: '"TEROSIER" <EMAIL_KAMU@gmail.com>',
    to: email,
    subject: "Kode Verifikasi",
    html: `<h2>Kode kamu: ${kode}</h2>`,
  });
};
