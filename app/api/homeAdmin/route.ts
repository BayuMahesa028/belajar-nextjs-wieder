import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "secret";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    // ❌ Tidak ada token
    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized - belum login" },
        { status: 401 },
      );
    }

    // 🔐 VERIFY TOKEN
    let user: any;
    try {
      user = jwt.verify(token, SECRET);
    } catch (err) {
      return NextResponse.json(
        { message: "Token tidak valid" },
        { status: 401 },
      );
    }

    // ❌ Bukan role user (harus 2)
    if (user.role !== 1) {
      return NextResponse.json(
        { message: "Akses ditolak (bukan user)" },
        { status: 403 },
      );
    }

    // ✅ SUCCESS
    return NextResponse.json({
      success: true,
      user: {
        email: user.email,
        nama_lengkap: user.nama_lengkap,
        role: user.role,
      },
    });
  } catch (err) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
