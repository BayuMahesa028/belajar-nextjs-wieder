"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import closeIcon from "../../src/ikon/close.svg";

type FormType = {
    email: string;
};

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [form, setForm] = useState<FormType>({ email: "" });
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
    const [message, setMessage] = useState("");

    const handleChange = (field: keyof FormType, value: string) => {
        setForm((prev) => ({
            ...prev,
            [field]: value,
        }));
        if (status !== "idle") setStatus("idle");
    };

    const handleForgotPassword = async () => {
        if (!form.email) {
            setStatus("error");
            setMessage("Email wajib diisi!");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(form.email)) {
            setStatus("error");
            setMessage("Format email tidak valid!");
            return;
        }

        setLoading(true);
        setStatus("idle");

        try {
            // ✅ FIXED: /api/lupaPassword (sesuai backend Anda)
            const res = await fetch("/api/lupaPassword", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: form.email }),
            });

            const data = await res.json();

            if (res.ok) {
                setStatus("success");
                setMessage(data.message || "Kode reset password dikirim!");

                // 🚀 AUTO REDIRECT KE VERIFY PASSWORD (1.5 detik)
                setTimeout(() => {
                    router.push(`/verifyPassword?email=${encodeURIComponent(form.email)}`);
                }, 1500);

            } else {
                setStatus("error");
                setMessage(data.message || "Gagal mengirim kode");
            }
        } catch (err) {
            console.error("Frontend Error:", err);
            setStatus("error");
            setMessage("Koneksi error, coba lagi");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-500 to-orange-600 text-black p-4">
            <div className="bg-zinc-900 p-8 rounded-2xl shadow-2xl w-full max-w-md relative border border-zinc-700 text-white animate-in fade-in zoom-in duration-500">
                <button
                    onClick={() => router.push("/login")}
                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-orange-500/20 hover:scale-110 transition-all duration-200"
                    disabled={loading}
                >
                    <Image src={closeIcon} alt="close" width={20} height={20} />
                </button>

                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.27 7.27c.883.883 2.317.883 3.2 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold mb-2">Lupa Password?</h1>
                    <p className="text-zinc-400 text-sm">Masukkan email Anda dan kami akan kirimkan kode reset</p>
                </div>

                <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                    <div>
                        <label className="block text-sm font-medium mb-2">Email</label>
                        <input
                            type="email"
                            value={form.email}
                            onChange={(e) => handleChange("email", e.target.value)}
                            className="w-full p-3 bg-zinc-800 border border-zinc-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-white placeholder-zinc-500"
                            placeholder="email@gmail.com"
                            disabled={loading}
                        />
                    </div>

                    {status === "success" && (
                        <div className="p-4 bg-green-500/20 border border-green-500/50 rounded-xl text-green-100 text-sm animate-pulse">
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                {message} <span className="text-xs ml-1">(menuju verifikasi...)</span>
                            </div>
                        </div>
                    )}

                    {status === "error" && (
                        <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-100 text-sm">
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                {message}
                            </div>
                        </div>
                    )}

                    <div className="space-y-3 pt-2">
                        <button
                            type="button"
                            onClick={handleForgotPassword}
                            disabled={loading || !form.email}
                            className="w-full bg-gradient-to-r from-yellow-500 to-orange-600 text-black font-semibold py-3 px-4 rounded-xl hover:scale-105 hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-black" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Mengirim...
                                </>
                            ) : (
                                "Kirim Kode Reset"
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={() => router.push("/login")}
                            className="w-full text-zinc-400 hover:text-white font-medium py-2 px-4 rounded-xl hover:bg-zinc-800/50 transition-all text-sm border border-zinc-700"
                            disabled={loading}
                        >
                            Kembali ke Login
                        </button>
                    </div>
                </form>

                <div className="mt-8 pt-6 border-t border-zinc-800 text-center">
                    <p className="text-xs text-zinc-500">Cek folder spam jika tidak menerima email</p>
                </div>
            </div>
        </div>
    );
}