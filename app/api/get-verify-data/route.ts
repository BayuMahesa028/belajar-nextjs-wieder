import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies(); // ✅ FIX WAJIB
    const data = cookieStore.get("verify_data");

    if (!data) {
      return NextResponse.json(
        { message: "Data tidak ditemukan" },
        { status: 404 },
      );
    }

    return NextResponse.json(JSON.parse(data.value));
  } catch (err) {
    return NextResponse.json(
      { message: "Gagal membaca cookie" },
      { status: 500 },
    );
  }
}
