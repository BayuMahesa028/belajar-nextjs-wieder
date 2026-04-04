"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import logo from "../../src/ikon/kunci.png";

export default function VerifyPage() {
  const router = useRouter();

  const [userData, setUserData] = useState<any>(null);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [timer, setTimer] = useState(60);

  // ⏱ countdown
  useEffect(() => {
    if (timer === 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  // 🔥 AMBIL COOKIE
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/get-verify-data", {
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        alert("Session habis, silakan register ulang");
        router.push("/register");
        return;
      }

      setUserData(data);
    };

    fetchData();
  }, [router]);

  // ✅ VERIFY
  const handleVerify = async () => {
    if (!userData?.email) {
      alert("Session tidak ditemukan");
      return;
    }

    if (!code) {
      alert("Masukkan kode verifikasi");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: userData.email,
          code,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      alert("Verifikasi berhasil!");
      router.push("/");
    } catch (err) {
      alert("Terjadi kesalahan, coba lagi");
    } finally {
      setLoading(false);
    }
  };

  // 🔁 RESEND OTP
  const handleResend = async () => {
    if (!userData?.email || !userData?.no_hp) {
      alert("Session tidak ditemukan");
      return;
    }

    try {
      setResendLoading(true);

      const res = await fetch("/api/resend-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: userData.email,
          no_hp: userData.no_hp,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      alert("Kode OTP baru dikirim!");
      setTimer(60);
    } catch (err) {
      alert("Gagal kirim ulang OTP");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-500 via-orange-500 to-red-500 p-4">
      <div className="w-full max-w-4xl bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden grid md:grid-cols-2">
        {/* LEFT */}
        <div className="hidden md:flex flex-col items-center justify-center p-10 text-white bg-black">
          <Image src={logo} alt="Logo" width={120} height={120} />
          <h1 className="text-4xl font-bold mt-4">TEROSIER</h1>
        </div>

        {/* RIGHT */}
        <div className="p-8 bg-black text-white">
          <h2 className="text-2xl mb-4">Verifikasi Akun</h2>

          <input
            type="text"
            placeholder="Masukkan kode OTP"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            maxLength={6}
            className="w-full p-3 bg-zinc-800 rounded mb-4 text-center tracking-widest"
          />

          <button
            onClick={handleVerify}
            disabled={loading}
            className="w-full bg-orange-500 p-3 rounded"
          >
            {loading ? "Memverifikasi..." : "Verifikasi"}
          </button>

          <div className="mt-4 text-center text-sm">
            {timer > 0 ? (
              <p>Kirim ulang dalam {timer} detik</p>
            ) : (
              <button onClick={handleResend}>
                {resendLoading ? "Mengirim..." : "Kirim Ulang OTP"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
