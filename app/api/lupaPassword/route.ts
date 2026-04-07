import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

interface ForgotPasswordBody {
  email: string;
}

export async function POST(req: Request) {
  try {
    const body: ForgotPasswordBody = await req.json();
    const { email } = body;

    console.log(
      "🔍 RESEND_KEY:",
      !!process.env.RESEND_API_KEY ? "LOADED" : "MISSING",
    );
    console.log("📧 Request email:", email);

    if (!email) {
      return NextResponse.json(
        { message: "Email wajib diisi" },
        { status: 400 },
      );
    }

    // CEK USER
    const userQuery = await pool.query(
      `SELECT id, nama_lengkap, tempat_lahir, tanggal_lahir, alamat, no_hp, email, password, bagian, disabilitas, alasan, sumber_info, role FROM users WHERE email = $1`,
      [email],
    );

    if (userQuery.rows.length === 0) {
      console.log("⚠️ Email not found:", email);
      return NextResponse.json(
        { message: "Jika email terdaftar, kode reset akan dikirim" },
        { status: 200 },
      );
    }

    const user = userQuery.rows[0];
    console.log("✅ User found:", user.nama_lengkap);

    // CLEANUP PENDING
    await pool.query("DELETE FROM pending_users WHERE email = $1", [email]);

    // GENERATE OTP
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();
    console.log("🔢 Generated OTP:", verificationCode);

    // INSERT TO PENDING_USERS
    await pool.query(
      `INSERT INTO pending_users (nama_lengkap, tempat_lahir, tanggal_lahir, alamat, no_hp, email, password, bagian, disabilitas, alasan, sumber_info, role, verification_code) 
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)`,
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
        verificationCode,
      ],
    );
    console.log("✅ Inserted to pending_users");

    // 🚀 SEND EMAIL - FIXED FROM
    try {
      console.log("📤 Sending email...");
      await resend.emails.send({
        from: "onboarding@resend.dev", // ✅ FIXED: Default Resend
        to: email,
        subject: "🔐 Reset Password TEROSIER",
        html: `
          <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #f59e0b 0%, #f97316 100%); padding: 2rem; border-radius: 16px 16px 0 0; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 24px;">TEROSIER</h1>
            </div>
            <div style="background: #1f2937; padding: 2rem; border-radius: 0 0 16px 16px; color: white;">
              <h2 style="font-size: 20px; margin-bottom: 1rem;">Halo ${user.nama_lengkap}!</h2>
              <div style="background: #374151; border-radius: 12px; padding: 2rem; text-align: center; margin: 2rem 0;">
                <h1 style="font-size: 36px; font-weight: bold; letter-spacing: 8px; margin: 0; color: #f59e0b; font-family: monospace;">
                  ${verificationCode}
                </h1>
                <p style="margin: 1rem 0 0 0; color: #9ca3af;">Kode berlaku 10 menit</p>
              </div>
              <p style="color: #9ca3af; text-align: center;">Gunakan kode ini di halaman verifikasi password</p>
            </div>
          </div>
        `,
      });
      console.log("✅ EMAIL SENT SUCCESSFULLY!");
    } catch (emailError: any) {
      console.error("❌ EMAIL ERROR:", emailError.message);
      // TETAP SUKSES UNTUK SECURITY
    }

    console.log(`✅ FULL SUCCESS - ${email} - OTP: ${verificationCode}`);
    return NextResponse.json({
      success: true,
      message: "Kode reset password telah dikirim ke email Anda!",
    });
  } catch (err: any) {
    console.error("❌ SERVER ERROR:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
