"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import Button from "../../src/components/button";
import closeIcon from "../../src/ikon/close.svg";

export default function RegisterPage() {
  const router = useRouter();

  const handleRegister = () => {
    console.log("Register clicked");
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
              />
            </div>

            <div className="w-1/2">
              <label className="text-sm font-medium">Tanggal Lahir</label>
              <input
                type="date"
                className="w-full p-2 bg-zinc-800 border border-zinc-600 rounded-lg mt-1 focus:ring-2 focus:ring-orange-500"
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
            />
          </div>

          {/* No HP */}
          <div>
            <label className="text-sm font-medium">No. HP / WhatsApp</label>
            <input
              type="text"
              className="w-full p-2 bg-zinc-800 border border-zinc-600 rounded-lg mt-1 focus:ring-2 focus:ring-orange-500"
              placeholder="08xxxxxxxxxx"
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              type="email"
              className="w-full p-2 bg-zinc-800 border border-zinc-600 rounded-lg mt-1 focus:ring-2 focus:ring-orange-500"
              placeholder="email@gmail.com"
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-sm font-medium">Password</label>
            <input
              type="password"
              className="w-full p-2 bg-zinc-800 border border-zinc-600 rounded-lg mt-1 focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Konfirmasi Password */}
          <div>
            <label className="text-sm font-medium">Ketik Ulang Password</label>
            <input
              type="password"
              className="w-full p-2 bg-zinc-800 border border-zinc-600 rounded-lg mt-1 focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Pilih Bagian */}
          <div>
            <label className="text-sm font-medium">Pilih bagian</label>
            <select className="w-full p-2 bg-zinc-800 border border-zinc-600 rounded-lg mt-1 focus:ring-2 focus:ring-orange-500">
              <option>Pilih bagian</option>
              <option>Navigation</option>
              <option>Swiper</option>
              <option>Leader</option>
              <option>Medice</option>
              <option>Koki</option>
            </select>
          </div>

          {/* Disabilitas */}
          <div>
            <label className="text-sm font-medium">
              Apakah kamu disabilitas?
            </label>
            <select className="w-full p-2 bg-zinc-800 border border-zinc-600 rounded-lg mt-1 focus:ring-2 focus:ring-orange-500">
              <option>Pilih</option>
              <option>Tidak</option>
              <option>Ya</option>
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
            />
          </div>

          {/* Info dari */}
          <div>
            <label className="text-sm font-medium">
              Mengetahui Terosier dari
            </label>
            <select className="w-full p-2 bg-zinc-800 border border-zinc-600 rounded-lg mt-1 focus:ring-2 focus:ring-orange-500">
              <option>Pilih</option>
              <option>Instagram</option>
              <option>Teman</option>
              <option>Website</option>
              <option>Lainnya</option>
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
