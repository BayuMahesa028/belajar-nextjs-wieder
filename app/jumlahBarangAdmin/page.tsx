"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function JumlahBarangAdmin() {
  const [user, setUser] = useState<any>(null);
  const [barang, setBarang] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // ✅ MODAL TAMBAH (punya kamu)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showModalContent, setShowModalContent] = useState(false);

  // ✅ TAMBAHAN POPUP
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [selectedDelete, setSelectedDelete] = useState<string | null>(null);

  const [form, setForm] = useState({ kode: "", nama: "", rincian: "" });
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const resUser = await fetch("/api/homeAdmin");
      const userData = await resUser.json();
      if (!resUser.ok || userData.user.role !== 1) return router.push("/");
      setUser(userData.user);

      const resBarang = await fetch("/api/jumlahBarangAdmin");
      const barangData = await resBarang.json();
      setBarang(barangData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ================= SKU =================
  const generateSKU = (name: string) => {
    if (!name.trim()) return "";
    const clean = name.replace(/\s+/g, "").toUpperCase();
    const first = clean.charAt(0);
    const mid = clean.charAt(Math.floor(clean.length / 2));
    const last = clean.charAt(clean.length - 1);

    const now = new Date();
    const dateStr = String(now.getDate()).padStart(2, "0");
    const monthStr = String(now.getMonth() + 1).padStart(2, "0");

    return `${first}${mid}${last}-${dateStr}${monthStr}`;
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setForm({ ...form, nama: val, kode: generateSKU(val) });
  };

  // ================= MODAL TAMBAH =================
  const openModal = () => {
    setIsModalOpen(true);
    setTimeout(() => setShowModalContent(true), 10);
  };

  const closeModal = () => {
    setShowModalContent(false);
    setTimeout(() => {
      setIsModalOpen(false);
      setForm({ kode: "", nama: "", rincian: "" });
      setPreviews([]);
      setFiles([]);
    }, 300);
  };

  // ================= DETAIL =================
  const openDetail = (item: any) => {
    setSelectedItem(item);
    setIsDetailOpen(true);
  };

  const closeDetail = () => setIsDetailOpen(false);

  // ================= FILE =================
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selected = Array.from(e.target.files);
      setFiles(selected);
      setPreviews(selected.map((f) => URL.createObjectURL(f)));
    }
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("kode_barang", form.kode);
    formData.append("nama_barang", form.nama);
    formData.append("rincian_barang", form.rincian);
    files.forEach((f) => formData.append("fotos", f));

    const res = await fetch("/api/jumlahBarangAdmin", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      closeModal();
      fetchData();
    }
  };

  // ================= DELETE =================
  const handleDelete = async (kode: string) => {
    await fetch(`/api/jumlahBarangAdmin?kode=${kode}`, {
      method: "DELETE",
    });
    fetchData();
  };

  // ================= logout =================
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

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-orange-600 text-white font-black">
        MARBAY...
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
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
        <div className="flex justify-between mb-6">
          <h1 className="text-3xl font-black">Inventory</h1>

          <button
            onClick={openModal}
            className="bg-orange-600 text-white px-6 py-3 rounded-xl"
          >
            + Barang
          </button>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-2xl border overflow-hidden">
          <table className="w-full text-left">
            {/* HEADER */}
            <thead className="bg-slate-50 border-b">
              <tr className="text-[11px] font-bold uppercase text-slate-400">
                <th className="p-4 text-orange-400">Foto</th>
                <th className="p-4 text-orange-400">Nama</th>
                <th className="p-4 text-orange-400">Kode</th>
                <th className="p-4 text-orange-400 text-center">Aksi</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {barang.map((item: any) => (
                <tr key={item.kode_barang} className="hover:bg-orange-50">
                  {/* FOTO */}
                  <td
                    className="p-4 cursor-pointer"
                    onClick={() => openDetail(item)}
                  >
                    {item.fotos && item.fotos.length > 0 ? (
                      <img
                        src={item.fotos[0]}
                        className="w-12 h-12 object-cover rounded-lg border"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center text-xs text-slate-400">
                        No Img
                      </div>
                    )}
                  </td>

                  {/* NAMA */}
                  <td
                    className="p-4 font-semibold cursor-pointer hover:text-orange-600"
                    onClick={() => openDetail(item)}
                  >
                    {item.nama_barang}
                  </td>

                  {/* KODE */}
                  <td
                    className="p-4 font-mono text-xs text-orange-600 cursor-pointer"
                    onClick={() => openDetail(item)}
                  >
                    {item.kode_barang}
                  </td>

                  {/* AKSI */}
                  <td className="p-4 text-center">
                    <button
                      onClick={() => {
                        setSelectedDelete(item.kode_barang);
                        setShowDelete(true);
                      }}
                      className="px-3 py-1 text-xs font-bold text-red-500 bg-red-50 border border-red-200 rounded-lg hover:bg-red-500 hover:text-white transition"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* ================= MODAL TAMBAH ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">
          <div
            className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition ${
              showModalContent ? "opacity-100" : "opacity-0"
            }`}
            onClick={closeModal}
          />

          <div
            className={`relative bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 transition-all ${
              showModalContent ? "opacity-100 scale-100" : "opacity-0 scale-95"
            }`}
          >
            {/* HEADER + CLOSE */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Tambah Barang</h2>

              <button
                onClick={closeModal}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-red-500 hover:text-white transition"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                value={form.nama}
                onChange={handleNameChange}
                placeholder="Nama Barang"
                className="w-full p-3 border rounded-lg"
              />

              <input
                value={form.kode}
                readOnly
                className="w-full p-3 border rounded-lg bg-slate-100 text-xs"
              />

              <textarea
                value={form.rincian}
                onChange={(e) => setForm({ ...form, rincian: e.target.value })}
                placeholder="Rincian"
                className="w-full p-3 border rounded-lg"
              />

              <input type="file" multiple onChange={handleFileChange} />

              <div className="flex gap-2">
                {previews.map((src, i) => (
                  <img key={i} src={src} className="w-12 h-12 rounded" />
                ))}
              </div>

              <button className="w-full bg-orange-600 text-white py-2 rounded-lg">
                Simpan
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ================= DETAIL ================= */}
      {isDetailOpen && selectedItem && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={closeDetail}
          />

          <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl p-6">
            <h2 className="text-lg font-bold mb-2">
              {selectedItem.nama_barang}
            </h2>

            <p className="text-sm text-slate-500 mb-3">
              {selectedItem.kode_barang}
            </p>

            <p className="text-sm mb-4">{selectedItem.rincian_barang}</p>

            <div className="flex gap-2 overflow-x-auto mb-4">
              {selectedItem.fotos?.map((img: string, i: number) => (
                <img key={i} src={img} className="w-20 h-20 rounded-lg" />
              ))}
            </div>

            <button
              onClick={closeDetail}
              className="w-full bg-slate-900 text-white py-2 rounded-lg"
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
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowDelete(false)}
          />

          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 text-center">
            <h2 className="text-lg font-bold text-red-500 mb-2">Hapus Data?</h2>

            <p className="text-sm text-slate-500 mb-6">
              Data tidak bisa dikembalikan.
            </p>

            <div className="flex justify-center gap-3">
              <button
                onClick={() => setShowDelete(false)}
                className="px-4 py-2 bg-slate-200 rounded-lg"
              >
                Batal
              </button>

              <button
                onClick={() => {
                  if (selectedDelete) handleDelete(selectedDelete);
                  setShowDelete(false);
                }}
                className="px-4 py-2 bg-red-500 text-white rounded-lg"
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
