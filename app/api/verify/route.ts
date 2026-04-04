import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { email, code } = await req.json();

    // 🔎 CEK DI pending_users
    const result = await pool.query(
      "SELECT * FROM pending_users WHERE email = $1",
      [email],
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { message: "Data tidak ditemukan" },
        { status: 404 },
      );
    }

    const user = result.rows[0];

    // ❌ kode salah
    if (user.verification_code !== code) {
      return NextResponse.json({ message: "Kode salah" }, { status: 400 });
    }

    // ✅ MASUKKAN KE users
    await pool.query(
      `
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
    `,
      [
        user.nama_lengkap,
        user.tempat_lahir,
        user.tanggal_lahir,
        user.alamat,
        user.no_hp,
        user.email,
        user.password,
        user.bagian,
        user.disabilitas,
        user.alasan,
        user.sumber_info,
        user.role,
      ],
    );

    // ❌ HAPUS DARI pending
    await pool.query("DELETE FROM pending_users WHERE email = $1", [email]);

    return NextResponse.json({
      success: true,
      message: "Verifikasi berhasil, akun dibuat",
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
