import { NextResponse } from "next/server";
import pool from "@/lib/db";
import bcrypt from "bcrypt";

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
    const body: RegisterBody = await req.json();

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
    const checkUser = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (checkUser.rows.length > 0) {
      return NextResponse.json(
        { message: "Email sudah terdaftar" },
        { status: 400 },
      );
    }

    // HASH PASSWORD
    const hashedPassword = await bcrypt.hash(password, 10);

    // ROLE OTOMATIS ADMIN
    const role = 2;

    const query = `
      INSERT INTO users (
        kode_user,
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
        role
      )
      VALUES (
        generate_kode_user($1,$2,$3),
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12
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
    ];

    const result = await pool.query(query, values);

    return NextResponse.json({
      success: true,
      data: result.rows[0],
    });
  } catch (err: any) {
    console.error("ERROR ASLI:", err); // 🔥 debug penting

    return NextResponse.json(
      { message: err.message || "Internal server error" },
      { status: 500 },
    );
  }
}
