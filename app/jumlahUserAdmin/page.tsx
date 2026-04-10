"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function JumlahUserAdminPage() {
  const [admin, setAdmin] = useState<any>(null);
  const [dataUsers, setDataUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // 1. Sync fungsi Logout dari homeAdmin
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

  const getBagianStyle = (kode: string) => {
    const mapping: {
      [key: string]: {
        label: string;
        color: string;
        border: string;
        bg: string;
      };
    } = {
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

  const fetchData = async () => {
    try {
      const res = await fetch("/api/jumlahUserAdmin");
      const json = await res.json();
      if (!res.ok) {
        alert(json.message);
        router.push("/");
        return;
      }
      setAdmin(json.adminInfo);
      setDataUsers(json.allUsers);
    } catch (err) {
      router.push("/");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [router]);

  const handleDelete = async (id: number, nama: string) => {
    const konfirmasi = window.confirm(
      `Apakah Anda yakin ingin menghapus akun "${nama}"?`,
    );
    if (konfirmasi) {
      try {
        const res = await fetch("/api/jumlahUserAdmin", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });
        if (res.ok) {
          alert("User berhasil dihapus!");
          fetchData();
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden text-black">
      {/* HEADER - IDENTIK DENGAN homeAdmin */}
      <header className="bg-white/90 backdrop-blur-md shadow-xl sticky top-0 z-50 border-b border-orange-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <div
              className="text-xl md:text-2xl font-black bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent cursor-pointer"
              onClick={() => router.push("/homeAdmin")}
            >
              🛍️ MarbayStore
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-6">
              {[
                { label: "Table User", href: "/jumlahUserAdmin" },
                { label: "Table Barang", href: "/jumlahBarangAdmin" },
              ].map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`font-bold transition-all text-sm uppercase tracking-wide ${
                    item.href === "/jumlahUserAdmin"
                      ? "text-orange-600"
                      : "text-slate-800 hover:text-orange-600"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* User Actions */}
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 bg-orange-100/80 px-3 py-1.5 rounded-xl text-sm font-bold text-slate-800 border border-orange-200">
                <span className="w-7 h-7 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white text-xs">
                  {admin?.nama?.charAt(0)?.toUpperCase()}
                </span>
                <span className="hidden lg:inline">Hi, {admin?.nama}</span>
              </div>

              <button
                onClick={handleLogout}
                className="px-5 py-2 bg-gradient-to-r from-red-500 to-orange-600 text-white font-bold rounded-xl text-sm shadow-md hover:scale-105 transition-transform"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto p-6 md:p-10">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          {/* Header Tabel yang Dipercantik */}
          <div className="p-8 bg-white flex justify-between items-center border-b border-slate-50">
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                User List
              </h1>
              <p className="text-slate-400 text-sm font-medium">
                Manajemen akun customer terdaftar
              </p>
            </div>
            <div className="bg-orange-50 px-6 py-3 rounded-2xl border border-orange-100 text-center">
              <span className="block text-2xl font-black text-orange-600 leading-none">
                {dataUsers.length}
              </span>
              <span className="text-[10px] font-black uppercase text-orange-400 tracking-widest">
                Total Users
              </span>
            </div>
          </div>

          <div className="w-full overflow-hidden rounded-2xl border border-slate-200 shadow-lg">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gradient-to-r from-orange-50 to-orange-100">
                <tr>
                  <th className="p-5 text-[11px] font-extrabold uppercase text-orange-400 tracking-widest">
                    Kode
                  </th>
                  <th className="p-5 text-[11px] font-extrabold uppercase text-orange-400 tracking-widest">
                    Nama
                  </th>
                  <th className="p-5 text-[11px] font-extrabold uppercase text-orange-400 tracking-widest">
                    Email
                  </th>
                  <th className="p-5 text-[11px] font-extrabold uppercase text-orange-400 tracking-widest">
                    Bagian
                  </th>
                  <th className="p-5 text-[11px] font-extrabold uppercase text-orange-400 tracking-widest text-center">
                    Aksi
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 bg-white">
                {dataUsers.map((u) => {
                  const style = getBagianStyle(u.bagian);

                  return (
                    <tr
                      key={u.id}
                      className="group transition-all duration-300 hover:bg-gradient-to-r hover:from-orange-50 hover:to-orange-100/40"
                    >
                      {/* KODE */}
                      <td className="p-5 font-mono text-sm font-bold text-slate-400 transition-all duration-300 group-hover:text-orange-500">
                        #{u.kode_user}
                      </td>

                      {/* NAMA */}
                      <td className="p-5">
                        <div className="flex flex-col transition-all duration-300 group-hover:translate-x-1">
                          <span className="font-semibold text-slate-800 text-sm group-hover:text-orange-600 transition">
                            {u.nama_lengkap}
                          </span>
                          <span className="text-[11px] text-slate-400 group-hover:text-orange-400 transition">
                            User ID: {u.id}
                          </span>
                        </div>
                      </td>

                      {/* EMAIL */}
                      <td className="p-5 text-slate-500 text-sm transition-all duration-300 group-hover:text-orange-500">
                        {u.email}
                      </td>

                      {/* BAGIAN */}
                      <td className="p-5">
                        <span
                          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-bold tracking-wide uppercase border backdrop-blur-sm transition-all duration-300 group-hover:scale-105 ${style.bg} ${style.color} ${style.border}`}
                        >
                          <span className="w-2 h-2 rounded-full bg-current opacity-70 animate-pulse"></span>
                          {style.label}
                        </span>
                      </td>

                      {/* AKSI */}
                      <td className="p-5 text-center">
                        <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                          <button
                            onClick={() => handleDelete(u.id, u.nama_lengkap)}
                            className="
                            
                            px-4 py-2 rounded-xl text-[10px] font-bold uppercase 
                            border border-red-200 text-red-500 bg-red-50
                            hover:bg-red-500 hover:text-white hover:border-red-500
                            hover:shadow-lg hover:shadow-red-200
                            transition-all duration-300 active:scale-90"
                          >
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
