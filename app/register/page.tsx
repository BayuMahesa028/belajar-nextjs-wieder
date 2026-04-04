"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import Button from "../../src/components/button";
import closeIcon from "../../src/ikon/close.svg";

type FormType = {
  nama: string;
  tempat: string;
  tanggal: string;
  alamat: string;
  hp: string;
  email: string;
  password: string;
  confirmPassword: string;
  bagian: string;
  disabilitas: string;
  alasan: string;
  sumber: string;
};

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState<FormType>({
    nama: "",
    tempat: "",
    tanggal: "",
    alamat: "",
    hp: "",
    email: "",
    password: "",
    confirmPassword: "",
    bagian: "",
    disabilitas: "",
    alasan: "",
    sumber: "",
  });
  const handleChange = (field: keyof FormType, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleRegister = async () => {
    if (!form.nama || !form.email || !form.password) {
      alert("Nama, email, dan password wajib diisi!");
      return;
    }

    if (form.password !== form.confirmPassword) {
      alert("Password tidak sama!");
      return;
    }

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Register berhasil!");
        router.push("/verify");
      } else {
        alert(data.message || "Gagal register");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-500 to-orange-600 text-black">
      <div className="bg-zinc-900 p-8 rounded-2xl shadow-2xl w-full max-w-lg relative border border-zinc-700 text-white">
        {/* CLOSE BUTTON */}
        <button
          onClick={() => router.push("/")}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-orange-500/20 hover:scale-110 transition"
        >
          <Image src={closeIcon} alt="close" width={20} height={20} />
        </button>

        <h1 className="text-2xl font-bold text-center mb-6">Form Register</h1>

        <form className="space-y-4">
          {/* Nama */}
          <div>
            <label className="text-sm font-medium">
              Nama (Sesuai akta kelahiran)
            </label>
            <input
              type="text"
              className="w-full p-2 bg-zinc-800 border border-zinc-600 rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Masukkan nama lengkap"
              onChange={(e) => handleChange("nama", e.target.value)}
            />
          </div>

          {/* Tempat & Tanggal Lahir */}
          <div className="flex gap-2">
            <div className="w-1/2">
              <label className="text-sm font-medium">Tempat Lahir</label>
              <input
                type="text"
                className="w-full p-2 bg-zinc-800 border border-zinc-600 rounded-lg mt-1 focus:ring-2 focus:ring-orange-500"
                placeholder="Contoh: Bandung"
                onChange={(e) => handleChange("tempat", e.target.value)}
              />
            </div>

            <div className="w-1/2">
              <label className="text-sm font-medium">Tanggal Lahir</label>
              <input
                type="date"
                className="w-full p-2 bg-zinc-800 border border-zinc-600 rounded-lg mt-1 focus:ring-2 focus:ring-orange-500"
                onChange={(e) => handleChange("tanggal", e.target.value)}
              />
            </div>
          </div>

          {/* Alamat */}
          <div>
            <label className="text-sm font-medium">Alamat Rumah</label>
            <textarea
              className="w-full p-2 bg-zinc-800 border border-zinc-600 rounded-lg mt-1 focus:ring-2 focus:ring-orange-500"
              rows={3}
              placeholder="Masukkan alamat lengkap"
              onChange={(e) => handleChange("alamat", e.target.value)}
            />
          </div>

          {/* No HP */}
          <div>
            <label className="text-sm font-medium">No. HP / WhatsApp</label>
            <input
              type="text"
              className="w-full p-2 bg-zinc-800 border border-zinc-600 rounded-lg mt-1 focus:ring-2 focus:ring-orange-500"
              placeholder="08xxxxxxxxxx"
              onChange={(e) => handleChange("hp", e.target.value)}
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              type="email"
              className="w-full p-2 bg-zinc-800 border border-zinc-600 rounded-lg mt-1 focus:ring-2 focus:ring-orange-500"
              placeholder="email@gmail.com"
              onChange={(e) => handleChange("email", e.target.value)}
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-sm font-medium">Password</label>
            <input
              type="password"
              className="w-full p-2 bg-zinc-800 border border-zinc-600 rounded-lg mt-1 focus:ring-2 focus:ring-orange-500"
              onChange={(e) => handleChange("password", e.target.value)}
            />
          </div>

          {/* Konfirmasi Password */}
          <div>
            <label className="text-sm font-medium">Ketik Ulang Password</label>
            <input
              type="password"
              className="w-full p-2 bg-zinc-800 border border-zinc-600 rounded-lg mt-1 focus:ring-2 focus:ring-orange-500"
              onChange={(e) => handleChange("confirmPassword", e.target.value)}
            />
          </div>

          {/* Pilih Bagian */}
          <div>
            <label className="text-sm font-medium">Pilih bagian</label>
            <select
              className="w-full p-2 bg-zinc-800 border border-zinc-600 rounded-lg mt-1 focus:ring-2 focus:ring-orange-500"
              onChange={(e) => handleChange("bagian", e.target.value)}
            >
              <option value="">Pilih Bagian</option>
              <option value="ng">Navigator</option>
              <option value="sw">Swiper</option>
              <option value="la">Leader</option>
              <option value="md">Medice</option>
              <option value="kk">Koki</option>
            </select>
          </div>

          {/* Disabilitas */}
          <div>
            <label className="text-sm font-medium">
              Apakah kamu disabilitas?
            </label>
            <select
              className="w-full p-2 bg-zinc-800 border border-zinc-600 rounded-lg mt-1 focus:ring-2 focus:ring-orange-500"
              onChange={(e) => handleChange("disabilitas", e.target.value)}
            >
              <option value="">Disabilitas?</option>
              <option value="Tidak">Tidak</option>
              <option value="Ya">Ya</option>
            </select>
          </div>

          {/* Alasan */}
          <div>
            <label className="text-sm font-medium">
              Alasan memilih bagian tersebut
            </label>
            <textarea
              className="w-full p-2 bg-zinc-800 border border-zinc-600 rounded-lg mt-1 focus:ring-2 focus:ring-orange-500"
              rows={3}
              placeholder="Tulis alasan kamu..."
              onChange={(e) => handleChange("alasan", e.target.value)}
            />
          </div>

          {/* Info dari */}
          <div>
            <label className="text-sm font-medium">
              Mengetahui Terosier dari
            </label>
            <select
              className="w-full p-2 bg-zinc-800 border border-zinc-600 rounded-lg mt-1 focus:ring-2 focus:ring-orange-500"
              onChange={(e) => handleChange("sumber", e.target.value)}
            >
              <option value="">Pilih</option>
              <option value="Instagram">Instagram</option>
              <option value="Teman">Teman</option>
              <option value="Website">Website</option>
              <option value="Lainnya">Lainnya</option>
            </select>
          </div>

          {/* Button */}
          <button
            type="button"
            onClick={handleRegister}
            className="w-full bg-gradient-to-r from-yellow-500 to-orange-600 text-black font-semibold py-2 rounded-lg hover:scale-105 transition"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
