"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function JumlahBarangAdmin() {
  const [user, setUser] = useState<any>(null);
  const [barang, setBarang] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showModalContent, setShowModalContent] = useState(false);

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

  // LOGIK GENERATE KODE (Depan, Tengah, Belakang + TglBln)
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selected = Array.from(e.target.files);
      setFiles(selected);
      setPreviews(selected.map((f) => URL.createObjectURL(f)));
    }
  };

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

  const handleDelete = async (kode: string) => {
    if (confirm(`Hapus barang ${kode}?`)) {
      await fetch(`/api/jumlahBarangAdmin?kode=${kode}`, { method: "DELETE" });
      fetchData();
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
      <header className="bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-40 border-b border-orange-200/50">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div
            className="text-2xl font-black bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent cursor-pointer"
            onClick={() => router.push("/homeAdmin")}
          >
            🛍️ MarbayStore
          </div>
          <nav className="hidden lg:flex items-center space-x-6">
            <Link
              href="/jumlahUserAdmin"
              className="text-slate-800 hover:text-orange-600 font-bold transition-all text-sm uppercase"
            >
              User
            </Link>
            <Link
              href="/jumlahBarangAdmin"
              className="text-orange-600 font-bold text-sm uppercase border-b-2 border-orange-600"
            >
              Barang
            </Link>
          </nav>
          <div className="bg-orange-100 px-3 py-1.5 rounded-xl text-sm font-bold border border-orange-200 flex items-center gap-2">
            <div className="w-6 h-6 bg-orange-600 rounded-full flex items-center justify-center text-white text-[10px] uppercase">
              {user?.nama_lengkap?.charAt(0)}
            </div>
            {user?.nama_lengkap}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-800">Inventory</h1>
            <p className="text-slate-500 text-sm">Kelola stok barang Anda</p>
          </div>
          <button
            onClick={openModal}
            className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-2xl font-black shadow-lg transition-all active:scale-95"
          >
            + BARANG
          </button>
        </div>

        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b">
              <tr className="text-[11px] font-black uppercase text-slate-400">
                <th className="p-6">Produk</th>
                <th className="p-6">Kode</th>
                <th className="p-6">Rincian</th>
                <th className="p-6 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {barang.map((item: any) => (
                <tr
                  key={item.kode_barang}
                  className="hover:bg-orange-50/30 transition-all"
                >
                  <td className="p-6 flex items-center gap-4">
                    <div className="flex -space-x-3">
                      {item.fotos?.slice(0, 2).map((img: any, i: number) => (
                        <img
                          key={i}
                          src={img}
                          className="w-12 h-12 rounded-xl object-cover border-2 border-white shadow-sm"
                        />
                      ))}
                    </div>
                    <span className="font-bold">{item.nama_barang}</span>
                  </td>
                  <td className="p-6 font-mono text-xs font-bold text-orange-600">
                    {item.kode_barang}
                  </td>
                  <td className="p-6 text-sm text-slate-500 max-w-xs truncate">
                    {item.rincian_barang}
                  </td>
                  <td className="p-6 text-center">
                    <button
                      onClick={() => handleDelete(item.kode_barang)}
                      className="text-red-500 font-black text-[10px] uppercase hover:underline"
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

      {/* POP-UP MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div
            className={`absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] transition-opacity duration-500 ${showModalContent ? "opacity-100" : "opacity-0"}`}
            onClick={closeModal}
          ></div>
          <div
            className={`relative bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl transition-all duration-500 transform ${showModalContent ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-10"}`}
          >
            <div className="bg-orange-600 p-8 text-white flex justify-between items-center rounded-t-[2.5rem]">
              <h2 className="text-2xl font-black italic">TAMBAH DATA</h2>
              <button
                onClick={closeModal}
                className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <input
                  required
                  placeholder="NAMA BARANG"
                  className="p-4 bg-slate-50 rounded-2xl border outline-none focus:border-orange-500 transition-all text-sm font-bold"
                  value={form.nama}
                  onChange={handleNameChange}
                />
                <input
                  readOnly
                  placeholder="KODE OTOMATIS"
                  className="p-4 bg-slate-100 rounded-2xl border text-slate-400 font-mono text-xs"
                  value={form.kode}
                />
              </div>
              <textarea
                placeholder="RINCIAN"
                className="w-full p-4 bg-slate-50 rounded-2xl border h-28 resize-none text-sm outline-none focus:border-orange-500"
                value={form.rincian}
                onChange={(e) => setForm({ ...form, rincian: e.target.value })}
              />
              <div className="relative border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center hover:border-orange-500 group transition-all">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={handleFileChange}
                />
                <p className="text-sm font-black text-slate-400 group-hover:text-orange-600 tracking-tighter">
                  KLIK UNTUK UPLOAD FOTO
                </p>
              </div>
              <div className="flex gap-2 overflow-x-auto">
                {previews.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    className="w-16 h-16 rounded-xl object-cover border-2 border-orange-100 shadow-sm"
                  />
                ))}
              </div>
              <button className="w-full py-5 bg-orange-600 text-white font-black rounded-2xl shadow-xl hover:bg-orange-700 transition-all active:scale-95">
                SIMPAN BARANG
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
