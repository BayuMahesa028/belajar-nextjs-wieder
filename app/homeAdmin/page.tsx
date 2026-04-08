"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

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
      <header className="bg-white/90 backdrop-blur-md shadow-xl sticky top-0 z-50 border-b border-orange-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <div
              className="text-xl md:text-2xl font-black bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent cursor-pointer"
              onClick={() => router.push('/')}
            >
              🛍️ MarbayStore
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-6">
              {['Home', 'Dashboard', 'Shoes', 'Cart'].map((item) => (
                <a key={item} href="#" className="text-slate-800 hover:text-orange-600 font-bold transition-all text-sm uppercase tracking-wide">
                  {item}
                </a>
              ))}
            </nav>

            {/* Desktop User Actions */}
            <div className="hidden md:flex items-center gap-4">
              <div className="flex items-center gap-2 bg-orange-100/80 px-3 py-1.5 rounded-xl text-sm font-bold text-slate-800 border border-orange-200">
                <span className="w-7 h-7 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white text-xs">
                  {user.nama_lengkap?.charAt(0)?.toUpperCase()}
                </span>
                <span className="hidden lg:inline">Hi, {user.nama_lengkap}</span>
              </div>
              <button
                onClick={handleLogout}
                className="px-5 py-2 bg-gradient-to-r from-red-500 to-orange-600 text-white font-bold rounded-xl text-sm shadow-md hover:scale-105 transition-transform"
              >
                Logout
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-orange-100"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg className="w-6 h-6 text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-b border-orange-100 p-4 space-y-4 animate-in slide-in-from-top duration-300">
            <nav className="flex flex-col space-y-3">
              <a href="#" className="font-bold text-slate-700">🏠 Home</a>
              <a href="#" className="font-bold text-slate-700">📊 Dashboard</a>
              <a href="#" className="font-bold text-slate-700">👟 Shoes</a>
              <a href="#" className="font-bold text-slate-700">🛒 Cart</a>
            </nav>
            <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
              <p className="font-bold text-sm text-orange-600">User: {user.nama_lengkap}</p>
              <button onClick={handleLogout} className="w-full py-3 bg-red-500 text-white rounded-xl font-bold">Logout</button>
            </div>
          </div>
        )}
      </header>

      {/* HERO SECTION */}
      <section className="relative pt-12 pb-20 md:py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
          <div className="space-y-6 text-center lg:text-left">
            <div className="inline-block bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full text-xs md:text-sm font-bold text-slate-800 shadow-md border border-orange-200">
              🔥 Welcome Back, {user.nama_lengkap}!
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-tight text-slate-900">
              Premium <span className="text-white drop-shadow-md">Shoes</span>
              <br className="hidden md:block" /> Collection 2024
            </h1>
            <p className="text-lg md:text-xl text-slate-800 max-w-lg mx-auto lg:mx-0 leading-relaxed font-medium">
              Temukan sepatu terbaik dengan kualitas premium. Siap lengkapi gaya kamu hari ini!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
              <a href="#" className="bg-white shadow-xl px-8 py-4 rounded-2xl font-black text-lg text-slate-800 hover:scale-105 transition-all text-center">
                🛒 Belanja Sekarang
              </a>
              <a href="#" className="border-2 border-white/50 text-white px-8 py-4 rounded-2xl font-bold hover:bg-white/20 backdrop-blur-sm transition-all text-center">
                📋 Lihat Katalog
              </a>
            </div>
          </div>

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
            { num: "10K+", label: "Pelanggan" },
            { num: "500+", label: "Produk" },
            { num: "99%", label: "Puas" },
            { num: "24/7", label: "Support" }
          ].map((stat, i) => (
            <div key={i} className="bg-white/70 backdrop-blur-sm p-4 md:p-6 rounded-2xl shadow-lg border border-white/50 text-center">
              <div className="text-2xl md:text-3xl font-black text-orange-600">{stat.num}</div>
              <div className="text-xs md:text-sm font-bold text-slate-700">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-20 px-4 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4">
              Kenapa Pilih <span className="text-orange-600">Kami</span>?
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: "🚚", title: "Free Ongkir", desc: "Min. belanja Rp200rb", color: "from-orange-500 to-red-500" },
              { icon: "✅", title: "Garansi", desc: "Produk original 100%", color: "from-green-500 to-emerald-500" },
              { icon: "⚡", title: "Cepat", desc: "Proses kurang dari 24 jam", color: "from-yellow-500 to-orange-500" },
              { icon: "💳", title: "Cicilan", desc: "Cicil 0% tanpa bunga", color: "from-blue-500 to-indigo-500" }
            ].map((feature, i) => (
              <div key={i} className="p-6 rounded-3xl bg-white shadow-md hover:-translate-y-2 transition-all border border-orange-50">
                <div className={`text-3xl mb-4 p-3 rounded-xl bg-gradient-to-r ${feature.color} w-fit text-white shadow-sm`}>{feature.icon}</div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRODUCTS PREVIEW - Responsive Grid */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-black text-slate-900">Produk Terlaris</h2>
              <p className="text-slate-800 font-medium">Pilihan terbaik untukmu</p>
            </div>
            <button className="hidden sm:block text-orange-900 font-bold hover:underline">Lihat Semua →</button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="group bg-white rounded-3xl overflow-hidden shadow-xl border border-orange-100 flex flex-col">
                <div className="h-48 md:h-56 relative bg-slate-50">
                  <Image
                    src={`/shoe-${i + 1}.png`}
                    alt="Shoe"
                    fill
                    className="object-contain p-6 group-hover:scale-110 transition-transform"
                  />
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="font-bold text-slate-900 text-lg mb-2">Nike Air Max Premium</h3>
                  <div className="mt-auto">
                    <div className="text-orange-600 font-black text-xl mb-4">Rp 899.000</div>
                    <button className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold text-sm hover:bg-orange-600 transition-colors">
                      + Keranjang
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-white pt-16 pb-8 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="space-y-4">
            <div className="text-2xl font-black text-orange-500">🛍️ MarbayStore</div>
            <p className="text-slate-400 text-sm">Toko sepatu premium #1 di Indonesia. Kualitas terjamin, harga bersahabat!</p>
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
              <input type="text" className="bg-slate-800 rounded-lg px-3 py-2 text-sm w-full outline-none" placeholder="Email.." />
              <button className="bg-orange-600 px-4 py-2 rounded-lg text-sm font-bold">Go</button>
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