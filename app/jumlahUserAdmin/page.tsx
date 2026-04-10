"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function JumlahUserAdminPage() {
  const [admin, setAdmin] = useState<any>(null);
  const [dataUsers, setDataUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/jumlahUserAdmin");
        const json = await res.json();

        if (!res.ok) {
          alert(json.message);
          router.push("/"); // Tendang ke home jika bukan admin
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

    fetchData();
  }, [router]);

  if (loading)
    return (
      <div className="min-h-screen bg-orange-600 flex items-center justify-center text-white font-bold text-xl animate-pulse">
        Memuat Data Admin...
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navbar Sederhana */}
      <nav className="bg-white shadow-md p-4 flex justify-between items-center px-8 sticky top-0 z-50">
        <Link href="/homeAdmin" className="text-2xl font-black text-orange-600">
          🛍️ MarbayAdmin
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-sm font-semibold text-slate-600 italic">
            Halo, {admin?.nama}
          </span>
          <button
            onClick={() => router.push("/")}
            className="bg-slate-800 text-white px-4 py-2 rounded-lg text-xs font-bold"
          >
            Kembali
          </button>
        </div>
      </nav>

      {/* Konten Utama */}
      <main className="max-w-7xl mx-auto p-6 md:p-10">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="p-6 bg-gradient-to-r from-orange-500 to-red-600">
            <h1 className="text-2xl font-black text-white">
              Daftar Pengguna Sistem
            </h1>
            <p className="text-orange-100 text-sm">
              Manajemen data user MarbayStore
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="p-4 text-xs font-black uppercase text-slate-500">
                    Kode
                  </th>
                  <th className="p-4 text-xs font-black uppercase text-slate-500">
                    Nama Lengkap
                  </th>
                  <th className="p-4 text-xs font-black uppercase text-slate-500">
                    Email
                  </th>
                  <th className="p-4 text-xs font-black uppercase text-slate-500">
                    Bagian
                  </th>
                  <th className="p-4 text-xs font-black uppercase text-slate-500">
                    Role
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {dataUsers.map((u) => (
                  <tr
                    key={u.id}
                    className="hover:bg-orange-50/50 transition-colors"
                  >
                    <td className="p-4 font-bold text-orange-600">
                      {u.kode_user}
                    </td>
                    <td className="p-4 font-semibold text-slate-800">
                      {u.nama_lengkap}
                    </td>
                    <td className="p-4 text-slate-600">{u.email}</td>
                    <td className="p-4 text-slate-600">{u.bagian}</td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${u.role === 1 ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"}`}
                      >
                        {u.role === 1 ? "Admin" : "User"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
