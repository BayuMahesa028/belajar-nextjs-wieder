"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function JumlahUserAdminPage() {
  // const [admin, setAdmin] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [dataUsers, setDataUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // ================= STATE BARU =================
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [selectedDelete, setSelectedDelete] = useState<any>(null);

  const router = useRouter();

  // ================= LOGOUT =================
  const handleLogout = async () => {
    const res = await fetch("/api/logout", { method: "POST" });
    if (res.ok) {
      alert("Logout berhasil!");
      router.push("/");
    }
  };

  // ================= STYLE =================
  const getBagianStyle = (kode: string) => {
    const mapping: any = {
      ng: {
        label: "Navigator",
        color: "text-blue-700",
        border: "border-blue-200",
        bg: "bg-blue-50",
      },
      sw: {
        label: "Swiper",
        color: "text-purple-700",
        border: "border-purple-200",
        bg: "bg-purple-50",
      },
      la: {
        label: "Leader",
        color: "text-emerald-700",
        border: "border-emerald-200",
        bg: "bg-emerald-50",
      },
      md: {
        label: "Medice",
        color: "text-pink-700",
        border: "border-pink-200",
        bg: "bg-pink-50",
      },
      kk: {
        label: "Koki",
        color: "text-amber-700",
        border: "border-amber-200",
        bg: "bg-amber-50",
      },
    };
    return (
      mapping[kode.toLowerCase()] || {
        label: kode.toUpperCase(),
        color: "text-slate-600",
        border: "border-slate-200",
        bg: "bg-slate-50",
      }
    );
  };

  // ================= FETCH =================
  const fetchData = async () => {
    try {
      const res = await fetch("/api/jumlahUserAdmin");
      const json = await res.json();
      if (!res.ok) return router.push("/");

      setUser(json.adminInfo);
      setDataUsers(json.allUsers);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ================= LOCK SCROLL =================
  useEffect(() => {
    if (isDetailOpen || showDelete) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isDetailOpen, showDelete]);

  // ================= DELETE =================
  const handleDelete = async () => {
    if (!selectedDelete) return;

    await fetch("/api/jumlahUserAdmin", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: selectedDelete.id }),
    });

    setShowDelete(false);
    fetchData();
  };

  // ================= LOADING =================
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-orange-500 text-white font-black">
        LOADING...
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50 text-black">
      {/* HEADER */}
      <header className="bg-white/90 backdrop-blur-md shadow-xl sticky top-0 z-50 border-b border-orange-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* header */}

          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <div
              className="text-xl md:text-2xl font-black bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent cursor-pointer"
              onClick={() => router.push("/")}
            >
              🛍️ MarbayStore
            </div>
            {/* Desktop Navigation */}
            {/* import Link from "next/link"; // ... di dalam komponen kamu */}
            <nav className="hidden lg:flex items-center space-x-6">
              {[
                { label: "Table User", href: "/jumlahUserAdmin" },
                { label: "Table Barang", href: "/jumlahBarangAdmin" },
                // ...
              ].map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-slate-800 hover:text-orange-600 font-bold transition-all text-sm uppercase tracking-wide"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Desktop User Actions */}
            <div className="hidden md:flex items-center gap-4">
              <div className="flex items-center gap-2 bg-orange-100/80 px-3 py-1.5 rounded-xl text-sm font-bold text-slate-800 border border-orange-200">
                <span className="w-7 h-7 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white text-xs">
                  {user.nama_lengkap?.charAt(0)?.toUpperCase()}
                </span>
                <span className="hidden lg:inline">
                  Hi, {user.nama_lengkap}
                </span>
              </div>

              {/* logout */}
              <button
                onClick={handleLogout}
                className="px-5 py-2 bg-gradient-to-r from-red-500 to-orange-600 text-white font-bold rounded-xl text-sm shadow-md hover:scale-105 transition-transform"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-b border-orange-100 p-4 space-y-4 animate-in slide-in-from-top duration-300">
            <nav className="flex flex-col space-y-3">
              <a href="#" className="font-bold text-slate-700">
                🏠 Home
              </a>
              <a href="#" className="font-bold text-slate-700">
                📊 Dashboard
              </a>
              <a href="#" className="font-bold text-slate-700">
                👟 Shoes
              </a>
              <a href="#" className="font-bold text-slate-700">
                🛒 Cart
              </a>
            </nav>
            <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
              <p className="font-bold text-sm text-orange-600">
                User: {user.nama_lengkap}
              </p>
              <button
                onClick={handleLogout}
                className="w-full py-3 bg-red-500 text-white rounded-xl font-bold"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </header>

      {/* MAIN */}
      <main className="max-w-7xl mx-auto p-6">
        <div className="bg-white rounded-2xl shadow border overflow-hidden">
          <table className="w-full text-left border-collapse">
            {/* HEADER */}
            <thead className="bg-gradient-to-r from-orange-50 to-orange-100 border-b">
              <tr>
                <th className="p-4 text-[11px] font-extrabold uppercase text-orange-400 tracking-widest">
                  Kode
                </th>
                <th className="p-4 text-[11px] font-extrabold uppercase text-orange-400 tracking-widest">
                  Nama
                </th>
                <th className="p-4 text-[11px] font-extrabold uppercase text-orange-400 tracking-widest">
                  Email
                </th>
                <th className="p-4 text-[11px] font-extrabold uppercase text-orange-400 tracking-widest">
                  Bagian
                </th>
                <th className="p-4 text-[11px] font-extrabold uppercase text-orange-400 tracking-widest text-center">
                  Aksi
                </th>
              </tr>
            </thead>

            {/* BODY */}
            <tbody className="divide-y divide-slate-100 bg-white">
              {dataUsers.map((u) => {
                const style = getBagianStyle(u.bagian);

                return (
                  <tr
                    key={u.id}
                    onClick={() => {
                      setSelectedUser(u);
                      setIsDetailOpen(true);
                    }}
                    className="cursor-pointer hover:bg-orange-50 transition"
                  >
                    <td className="p-4 font-mono text-xs text-orange-600 font-bold">
                      #{u.kode_user}
                    </td>

                    <td className="p-4 font-semibold hover:text-orange-600">
                      {u.nama_lengkap}
                    </td>

                    <td className="p-4 text-slate-500 text-sm">{u.email}</td>

                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-bold border ${style.bg} ${style.color} ${style.border}`}
                      >
                        {style.label}
                      </span>
                    </td>

                    <td className="p-4 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedDelete(u);
                          setShowDelete(true);
                        }}
                        className="px-3 py-1 text-xs font-bold text-red-500 bg-red-50 border border-red-200 rounded-lg hover:bg-red-500 hover:text-white transition"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </main>

      {/* ================= DETAIL ================= */}
      {isDetailOpen && selectedUser && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
            onClick={() => setIsDetailOpen(false)}
          />

          <div className="relative bg-white w-full max-w-md p-6 rounded-2xl">
            <h2 className="font-bold text-lg mb-4">Detail User</h2>

            <p>
              <b>Kode:</b> {selectedUser.kode_user}
            </p>
            <p>
              <b>Nama:</b> {selectedUser.nama_lengkap}
            </p>
            <p>
              <b>Email:</b> {selectedUser.email}
            </p>
            <p>
              <b>Bagian:</b> {selectedUser.bagian}
            </p>

            <button
              onClick={() => setIsDetailOpen(false)}
              className="mt-6 w-full bg-black text-white py-2 rounded-lg"
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      {/* ================= DELETE ================= */}
      {showDelete && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
            onClick={() => setShowDelete(false)}
          />

          <div className="relative bg-white p-6 rounded-2xl text-center w-full max-w-md">
            <h2 className="font-bold text-red-500 mb-2">Hapus User?</h2>

            <p className="mb-4 text-sm">{selectedDelete?.nama_lengkap}</p>

            <div className="flex justify-center gap-3">
              <button
                onClick={() => setShowDelete(false)}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                Batal
              </button>

              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white rounded"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
