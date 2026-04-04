import { NextResponse } from "next/server";
import pool from "@/lib/db";
import bcrypt from "bcrypt";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface RegisterBody {
  nama: string;
  tempat: string;
  tanggal: string;
  alamat: string;
  hp: string;
  email: string;
  password: string;
  bagian: string;
  disabilitas: string;
  alasan: string;
  sumber: string;
}

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
    if (!nama || !email || !password) {
      return NextResponse.json(
        { message: "Nama, email, password wajib diisi" },
        { status: 400 },
      );
    }

    // CEK EMAIL SUDAH ADA
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

    //Buat kode Verifikasi
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();

    // ROLE OTOMATIS ADMIN
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
      RETURNING *;
    `;

    const values = [
      nama,
      tempat,
      tanggal,
      alamat,
      hp,
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

    await resend.emails.send({
      from: "onboarding@resend.dev", // default dari resend
      to: email,
      subject: "Verifikasi Akun TEROSIER",
      html: `
    <div style="font-family:sans-serif">
      <h2>Halo ${nama} 👋</h2>
      <p>Gunakan kode berikut untuk verifikasi akun:</p>
      <h1 style="letter-spacing:5px">${verificationCode}</h1>
      <p>Kode ini berlaku beberapa menit.</p>
    </div>
  `,
    });
    return NextResponse.json({
      success: true,
      message: "Kode verifikasi dikirim",
    });
  } catch (err: any) {
    console.error("ERROR ASLI:", err); // 🔥 debug penting

    return NextResponse.json(
      { message: err.message || "Internal server error" },
      { status: 500 },
    );
  }
}
