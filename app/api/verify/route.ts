import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(req: Request) {
  const client = await pool.connect(); // Gunakan client untuk transaction
  try {
    const { email, code } = await req.json();

    // 🔎 1. CEK DI pending_users
    const result = await client.query(
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

    // ❌ 2. VALIDASI KODE
    if (user.verification_code !== code) {
      return NextResponse.json({ message: "Kode salah" }, { status: 400 });
    }

    // 🚀 MULAI TRANSAKSI
    await client.query("BEGIN");

    // ✅ 3. MASUKKAN KE users
    // Menambahkan explicit cast (::text, ::date) agar PostgreSQL tidak error 'unknown'
    const insertQuery = `
      INSERT INTO users (
        kode_user, nama_lengkap, tempat_lahir, tanggal_lahir, 
        alamat, no_hp, email, password, bagian, 
        disabilitas, alasan, sumber_info, role
      )
      VALUES (
        generate_kode_user($1::varchar, $2::varchar, $3::date),
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12
      )
    `;

    await client.query(insertQuery, [
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
    ]);

    // ❌ 4. HAPUS DARI pending_users
    await client.query("DELETE FROM pending_users WHERE email = $1", [email]);

    // SELESAI & SIMPAN
    await client.query("COMMIT");

    return NextResponse.json({
      success: true,
      message: "Verifikasi berhasil, akun dibuat",
    });
  } catch (err) {
    await client.query("ROLLBACK"); // Batalkan jika ada error di tengah jalan
    console.error("Error saat verifikasi:", err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  } finally {
    client.release(); // Kembalikan koneksi ke pool
  }
}
