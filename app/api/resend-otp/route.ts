import { NextResponse } from "next/server";
import pool from "@/lib/db";
import twilio from "twilio";

const client = twilio(process.env.TWILIO_SID!, process.env.TWILIO_AUTH_TOKEN!);

export async function POST(req: Request) {
  try {
    const { email, no_hp } = await req.json();

    const newCode = Math.floor(100000 + Math.random() * 900000).toString();

    await pool.query(
      "UPDATE pending_users SET verification_code = $1 WHERE email = $2",
      [newCode, email],
    );

    await client.messages.create({
      from: "whatsapp:+14155238886",
      to: `whatsapp:${no_hp}`,
      body: `Kode OTP baru kamu: ${newCode}`,
    });

    return NextResponse.json({
      message: "OTP berhasil dikirim ulang",
    });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
