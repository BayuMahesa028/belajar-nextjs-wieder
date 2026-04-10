import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import pool from "@/lib/db";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "secret";

// Ambil Semua Barang
export async function GET() {
  try {
    const res = await pool.query(
      "SELECT * FROM barang ORDER BY created_at DESC",
    );
    return NextResponse.json(res.rows);
  } catch (err) {
    return NextResponse.json({ message: "Gagal" }, { status: 500 });
  }
}

// Tambah Barang (Binary Upload)
export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const decoded: any = token ? jwt.verify(token, SECRET) : null;
    if (!decoded || decoded.role !== 1)
      return NextResponse.json({ message: "Akses Ditolak" }, { status: 403 });

    const formData = await req.formData();
    const kode = formData.get("kode_barang") as string;
    const nama = formData.get("nama_barang") as string;
    const rincian = formData.get("rincian_barang") as string;
    const files = formData.getAll("fotos") as File[];

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    const filePaths: string[] = [];
    for (const file of files) {
      if (file.size > 0) {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const name = `${Date.now()}-${file.name.replace(/\s+/g, "_")}`;
        await writeFile(path.join(uploadDir, name), buffer);
        filePaths.push(`/uploads/${name}`);
      }
    }

    await pool.query(
      "INSERT INTO barang (kode_barang, nama_barang, rincian_barang, fotos) VALUES ($1, $2, $3, $4)",
      [kode, nama, rincian, filePaths],
    );

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

// Hapus Barang
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const kode = searchParams.get("kode");
    await pool.query("DELETE FROM barang WHERE kode_barang = $1", [kode]);
    return NextResponse.json({ message: "Dihapus" });
  } catch (err) {
    return NextResponse.json({ message: "Gagal" }, { status: 500 });
  }
}
