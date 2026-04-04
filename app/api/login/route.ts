import { NextResponse } from "next/server";
import pool from "@/lib/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "secret";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    // 🔎 VALIDASI
    if (!email || !password) {
      return NextResponse.json(
        { message: "Email dan password wajib diisi" },
        { status: 400 },
      );
    }

    // 🔎 CEK USER
    const result = await pool.query(
      `SELECT 
        id,
        kode_user,
        nama_lengkap,
        email,
        password,
        role,
        bagian
      FROM users 
      WHERE email = $1`,
      [email],
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { message: "User tidak ditemukan" },
        { status: 404 },
      );
    }

    const user = result.rows[0];

    // 🔐 CEK PASSWORD
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return NextResponse.json({ message: "Password salah" }, { status: 401 });
    }

    // 🔥 BUAT TOKEN (ISI LENGKAP)
    const token = jwt.sign(
      {
        id: user.id,
        kode_user: user.kode_user,
        nama_lengkap: user.nama_lengkap,
        email: user.email,
        role: user.role,
        bagian: user.bagian,
      },
      SECRET,
      { expiresIn: "1d" },
    );

    // 🍪 SET COOKIE
    const response = NextResponse.json({
      success: true,
      message: "Login berhasil",
      user: {
        id: user.id,
        kode_user: user.kode_user,
        nama_lengkap: user.nama_lengkap,
        email: user.email,
        role: user.role,
        bagian: user.bagian,
      },
    });

    response.cookies.set("token", token, {
      httpOnly: true, // aman dari JS
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24, // 1 hari
    });

    return response;
  } catch (err: any) {
    console.error("LOGIN ERROR:", err);

    return NextResponse.json(
      { message: err.message || "Internal server error" },
      { status: 500 },
    );
  }
}
