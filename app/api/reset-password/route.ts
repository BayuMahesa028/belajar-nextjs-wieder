import { NextResponse } from "next/server";
import pool from "@/lib/db";
import bcrypt from "bcrypt";

interface ResetBody {
  email: string;
  code: string;
  newPassword: string;
}

export async function POST(req: Request) {
  const client = await pool.connect(); // Transaction
  try {
    await client.query("BEGIN");

    const body: ResetBody = await req.json();
    const { email, code, newPassword } = body;

    console.log("🔄 Reset password for:", email);

    if (!email || !code || !newPassword) {
      throw new Error("Semua field wajib diisi");
    }

    if (newPassword.length < 6) {
      throw new Error("Password minimal 6 karakter");
    }

    // 1. CEK & VALIDASI PENDING_USER
    const pendingQuery = await client.query(
      `SELECT * FROM pending_users WHERE email = $1 AND verification_code = $2 FOR UPDATE`,
      [email, code],
    );

    if (pendingQuery.rows.length === 0) {
      throw new Error("Kode verifikasi salah atau sudah kadaluarsa");
    }

    const pendingUser = pendingQuery.rows[0];
    console.log("✅ Pending user found:", pendingUser.nama_lengkap);

    // 2. HASH PASSWORD BARU
    const hashedNewPassword = await bcrypt.hash(newPassword, 12);
    console.log("🔐 New password hashed");

    // 3. UPDATE USERS TABLE
    const updateUsersQuery = `
      UPDATE users 
      SET 
        password = $1,
        alamat = $2,
        no_hp = $3,
        bagian = $4,
        disabilitas = $5,
        alasan = $6,
        sumber_info = $7,
        role = $8
      WHERE email = $9
      RETURNING id
    `;

    const updateUsersValues = [
      hashedNewPassword,
      pendingUser.alamat,
      pendingUser.no_hp,
      pendingUser.bagian,
      pendingUser.disabilitas,
      pendingUser.alasan,
      pendingUser.sumber_info,
      pendingUser.role,
      email,
    ];

    const updatedUser = await client.query(updateUsersQuery, updateUsersValues);

    if (updatedUser.rows.length === 0) {
      throw new Error("Gagal update user");
    }

    console.log("✅ Users table updated");

    // 4. HAPUS PENDING_USER (cleanup)
    await client.query("DELETE FROM pending_users WHERE email = $1", [email]);
    console.log("🧹 Pending user deleted");

    await client.query("COMMIT");
    console.log("🎉 PASSWORD RESET SUCCESS!");

    return NextResponse.json({
      success: true,
      message: "Password berhasil direset! Silakan login.",
    });
  } catch (err: any) {
    await client.query("ROLLBACK");
    console.error("❌ Reset password error:", err.message);

    return NextResponse.json(
      { message: err.message || "Gagal reset password" },
      { status: 400 },
    );
  } finally {
    client.release();
  }
}
