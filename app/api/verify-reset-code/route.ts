import { NextResponse } from "next/server";
import pool from "@/lib/db";

interface VerifyBody {
  email: string;
  code: string;
}

export async function POST(req: Request) {
  try {
    const body: VerifyBody = await req.json();
    const { email, code } = body;

    console.log("🔍 Verify request:", { email, code: code ? "***" : "empty" });

    if (!email || !code) {
      return NextResponse.json(
        { message: "Email dan kode wajib diisi" },
        { status: 400 },
      );
    }

    if (code.length !== 6) {
      return NextResponse.json(
        { message: "Kode harus 6 digit" },
        { status: 400 },
      );
    }

    // CEK PENDING_USERS
    const pendingQuery = await pool.query(
      `SELECT id, verification_code FROM pending_users WHERE email = $1`,
      [email],
    );

    if (pendingQuery.rows.length === 0) {
      return NextResponse.json(
        { message: "Kode verifikasi tidak ditemukan" },
        { status: 400 },
      );
    }

    const pendingUser = pendingQuery.rows[0];

    if (pendingUser.verification_code !== code) {
      console.log(
        "❌ Invalid code:",
        code,
        "Expected:",
        pendingUser.verification_code,
      );
      return NextResponse.json(
        { message: "Kode verifikasi salah" },
        { status: 400 },
      );
    }

    console.log("✅ Code verified for:", email);
    return NextResponse.json({
      success: true,
      message: "Kode verifikasi benar",
    });
  } catch (err: any) {
    console.error("❌ Verify error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
