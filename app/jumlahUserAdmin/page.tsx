"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import HeaderAdmin from "@/src/components/headerAdmin";

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
      <HeaderAdmin
        user={user}
        handleLogout={handleLogout}
        isMenuOpen={isMenuOpen}
      />

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
