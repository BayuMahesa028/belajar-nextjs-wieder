import { NextResponse } from "next/server";
import pool from "@/lib/db";
import bcrypt from "bcrypt";
import twilio from "twilio";
import { cookies } from "next/headers";

const client = twilio(process.env.TWILIO_SID!, process.env.TWILIO_AUTH_TOKEN!);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      nama,
      tempat,
      tanggal,
      alamat,
      hp,
      email,
      password,
      bagian,
      disabilitas,
      alasan,
      sumber,
    } = body;

    // VALIDASI
    if (!nama || !email || !password || !hp) {
      return NextResponse.json(
        { message: "Field wajib belum lengkap" },
        { status: 400 },
      );
    }

    // CEK EMAIL
    const checkUser = await pool.query(
      `
      SELECT email FROM pending_users WHERE email = $1
      UNION
      SELECT email FROM users WHERE email = $1
      `,
      [email],
    );

    if (checkUser.rows.length > 0) {
      return NextResponse.json(
        { message: "Email sudah terdaftar" },
        { status: 400 },
      );
    }

    // HASH PASSWORD
    const hashedPassword = await bcrypt.hash(password, 10);

    // FORMAT NOMOR
    let formattedHp = hp.trim();

    if (formattedHp.startsWith("08")) {
      formattedHp = "62" + formattedHp.slice(1);
    }

    if (formattedHp.startsWith("+62")) {
      formattedHp = formattedHp.slice(1);
    }

    if (!formattedHp.startsWith("62")) {
      return NextResponse.json(
        { message: "Nomor harus format Indonesia" },
        { status: 400 },
      );
    }

    const finalPhone = `+${formattedHp}`;

    // OTP
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();

    const role = 2;

    const query = `
      INSERT INTO pending_users (
        nama_lengkap,
        tempat_lahir,
        tanggal_lahir,
        alamat,
        no_hp,
        email,
        password,
        bagian,
        disabilitas,
        alasan,
        sumber_info,
        role,
        verification_code
      )
      VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13
      )
    `;

    const values = [
      nama,
      tempat,
      tanggal,
      alamat,
      finalPhone, // ✅ FIX
      email,
      hashedPassword,
      bagian,
      disabilitas === "Ya",
      alasan,
      sumber,
      role,
      verificationCode,
    ];

    await pool.query(query, values);

    // KIRIM WA
    await client.messages.create({
      from: "whatsapp:+14155238886",
      to: `whatsapp:${finalPhone}`,
      body: `Kode verifikasi kamu: ${verificationCode}`,
    });

    // ✅ bikin response dulu
    const response = NextResponse.json({
      message: "Register berhasil, cek WhatsApp untuk OTP",
    });

    // ✅ set cookie
    response.cookies.set(
      "verify_data",
      JSON.stringify({
        nama_lengkap: nama,
        email: email,
        no_hp: finalPhone,
      }),
      {
        httpOnly: true,
        secure: false, // true kalau production
        maxAge: 60 * 10,
        path: "/",
      },
    );
    return response;

    return NextResponse.json({
      message: "Register berhasil, cek WhatsApp untuk OTP",
    });
  } catch (err: any) {
    console.error("ERROR ASLI:", err);

    return NextResponse.json(
      { message: err.message || "Internal server error" },
      { status: 500 },
    );
  }
}
