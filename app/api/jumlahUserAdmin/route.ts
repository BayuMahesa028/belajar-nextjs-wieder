import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import pool from "@/lib/db";

const SECRET = process.env.JWT_SECRET || "secret";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Token tidak ditemukan" },
        { status: 401 },
      );
    }

    // 1. Verifikasi Token
    const decoded: any = jwt.verify(token, SECRET);

    // 2. Proteksi Role (Hanya Role 1 yang boleh masuk)
    if (decoded.role !== 1) {
      return NextResponse.json(
        { message: "Akses Ditolak! Khusus Admin." },
        { status: 403 },
      );
    }

    // 3. Ambil data semua user dari database untuk ditampilkan di tabel
    const result = await pool.query(
      "SELECT id, kode_user, nama_lengkap, email, bagian, role FROM users ORDER BY id DESC",
    );

    return NextResponse.json({
      success: true,
      adminInfo: {
        nama: decoded.nama_lengkap,
        email: decoded.email,
      },
      allUsers: result.rows,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Sesi tidak valid" }, { status: 401 });
  }
}
