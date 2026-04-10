import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import pool from "@/lib/db";

const SECRET = process.env.JWT_SECRET || "secret";

// --- GET DATA USER (Kecuali Admin/Role 1) ---
export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const decoded: any = jwt.verify(token, SECRET);
    if (decoded.role !== 1)
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });

    // Filter agar Admin (role 1) tidak muncul di daftar
    const result = await pool.query(
      "SELECT id, kode_user, nama_lengkap, email, bagian, role FROM users WHERE role != 1 ORDER BY id DESC",
    );

    return NextResponse.json({
      success: true,
      adminInfo: { nama: decoded.nama_lengkap, email: decoded.email },
      allUsers: result.rows,
    });
  } catch (err) {
    return NextResponse.json({ message: "Sesi tidak valid" }, { status: 401 });
  }
}

// --- DELETE USER ---
export async function DELETE(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const { id } = await req.json(); // Ambil ID dari body request

    if (!token)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const decoded: any = jwt.verify(token, SECRET);
    if (decoded.role !== 1)
      return NextResponse.json({ message: "Akses ditolak" }, { status: 403 });

    // Hapus user berdasarkan ID
    await pool.query("DELETE FROM users WHERE id = $1 AND role != 1", [id]);

    return NextResponse.json({
      success: true,
      message: "User berhasil dihapus",
    });
  } catch (err) {
    return NextResponse.json(
      { message: "Gagal menghapus user" },
      { status: 500 },
    );
  }
}
