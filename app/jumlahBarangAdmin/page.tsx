"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function JumlahBarangAdmin() {
  const [user, setUser] = useState<any>(null);
  const [barang, setBarang] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-orange-600 text-white font-black">
        MARBAY...
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* HEADER */}
      <header className="bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-40 border-b border-orange-200/50">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="text-2xl font-black text-orange-600">
            🛍️ MarbayStore
          </div>
        </div>
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
          <table className="w-full">
            <tbody>
              {barang.map((item: any) => (
                <tr key={item.kode_barang} className="hover:bg-orange-50">
                  <td
                    className="p-4 cursor-pointer"
                    onClick={() => openDetail(item)}
                  >
                    {item.nama_barang}
                  </td>

                  <td className="p-4 text-center">
                    <button
                      onClick={() => {
                        setSelectedDelete(item.kode_barang);
                        setShowDelete(true);
                      }}
                      className="text-red-500 text-xs"
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
            className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition ${showModalContent ? "opacity-100" : "opacity-0"}`}
            onClick={closeModal}
          />

          <div
            className={`relative bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 transition-all ${
              showModalContent ? "opacity-100 scale-100" : "opacity-0 scale-95"
            }`}
          >
            <h2 className="text-lg font-bold mb-4">Tambah Barang</h2>

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
