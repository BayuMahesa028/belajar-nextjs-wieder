import { NextResponse } from "next/server";

export async function POST() {
  try {
    const response = NextResponse.json({
      success: true,
      message: "Logout berhasil",
    });

    // ❌ HAPUS COOKIE
    response.cookies.set("token", "", {
      httpOnly: true,
      expires: new Date(0), // langsung expired
      path: "/",
    });

    return response;
  } catch (err) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
