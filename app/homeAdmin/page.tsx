"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import HeaderAdmin from "@/src/components/headerAdmin";

export default function HomeAdminPages() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State untuk mobile menu
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/homeAdmin");
        const data = await res.json();
        if (!res.ok) {
          alert(data.message || "Gagal login");
          router.push("/");
          return;
        }
        setUser(data.user);
      } catch (err) {
        console.error(err);
        router.push("/");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [router]);

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/logout", { method: "POST" });
      if (res.ok) {
        alert("Logout berhasil!");
        router.push("/");
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-500 to-orange-600 text-black overflow-x-hidden">
      {/* HEADER */}
      <HeaderAdmin
        user={user}
        handleLogout={handleLogout}
        isMenuOpen={isMenuOpen}
      />

      {/* HERO SECTION */}
      <section className="relative pt-12 pb-20 md:py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
          <div className="space-y-6 text-center lg:text-left">
            <div className="inline-block bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full text-xs md:text-sm font-bold text-slate-800 shadow-md border border-orange-200">
              🔥 Welcome Back, {user.nama_lengkap}!
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-tight text-slate-900">
              Beranda <span className="text-white drop-shadow-md">Admin</span>
              <br className="hidden md:block" /> Dimari
            </h1>
            <p className="text-lg md:text-xl text-slate-800 max-w-lg mx-auto lg:mx-0 leading-relaxed font-medium">
              Temukan apa masalah mu yang membuatmu Pusing hehehe !!!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4"></div>
          </div>

          {/* Foto bulet sebelah kanan */}
          <div className="relative order-first lg:order-last">
            <div className="relative w-full aspect-square max-w-[500px] mx-auto bg-white/30 backdrop-blur-xl rounded-full p-8 shadow-2xl border border-white/20">
              <Image
                src="/shoe-hero.png"
                alt="Premium Shoes"
                width={500}
                height={500}
                className="w-full h-full object-contain drop-shadow-2xl rotate-[-15deg] hover:rotate-0 transition-transform duration-500"
              />
            </div>
          </div>
        </div>

        {/* Stats - Responsive Grid */}
        <div className="max-w-7xl mx-auto mt-16 grid grid-cols-2 lg:grid-cols-4 gap-4 px-4">
          {[
            { num: "10K+", label: "Jumlah User" },
            { num: "500+", label: "Jumlah Barang" },
            { num: "99%", label: "Jumlah Checkout" },
            { num: "24/7", label: "Jumlah Keanggotaan" },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-white/70 backdrop-blur-sm p-4 md:p-6 rounded-2xl shadow-lg border border-white/50 text-center"
            >
              <div className="text-2xl md:text-3xl font-black text-orange-600">
                {stat.num}
              </div>
              <div className="text-xs md:text-sm font-bold text-slate-700">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-white pt-16 pb-8 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="space-y-4">
            <div className="text-2xl font-black text-orange-500">
              🛍️ MarbayStore
            </div>
            <p className="text-slate-400 text-sm">
              Toko sepatu premium #1 di Indonesia. Kualitas terjamin, harga
              bersahabat!
            </p>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-6">Support</h4>
            <ul className="space-y-3 text-slate-400 text-sm">
              <li>Pusat Bantuan</li>
              <li>Cara Pembelian</li>
              <li>Pengiriman</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-6">Kontak</h4>
            <ul className="space-y-3 text-slate-400 text-sm">
              <li>📞 0812-3456-7890</li>
              <li>✉️ help@marbay.com</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-6">Newsletter</h4>
            <div className="flex gap-2">
              <input
                type="text"
                className="bg-slate-800 rounded-lg px-3 py-2 text-sm w-full outline-none"
                placeholder="Email.."
              />
              <button className="bg-orange-600 px-4 py-2 rounded-lg text-sm font-bold">
                Go
              </button>
            </div>
          </div>
        </div>
        <div className="mt-16 pt-8 border-t border-slate-800 text-center text-slate-500 text-xs">
          © 2024 MarbayStore. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
}
