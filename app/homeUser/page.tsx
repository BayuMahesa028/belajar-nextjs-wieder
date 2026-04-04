"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function HomeUserPages() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/homeUser");
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
      }
    };
    fetchUser();
  }, [router]);

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/logout", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Gagal logout");
        return;
      }
      alert("Logout berhasil!");
      router.push("/");
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat logout");
    }
  };

  if (!user) {
    return <div className="p-5">Loading....</div>;
  }
  return (
    <div
      className="bg-slate-400 
        flex items-center justify-between h-10 px-5"
    >
      <div>MarbayStore</div>
      <div className="flex gap-5">
        <div>Home</div>
        <div>Dashboard</div>
        <div>Shoes</div>
      </div>
      <div className="flex items-center gap-3">
        👤 {user.nama_lengkap}

        <button
          onClick={handleLogout} className="bg-red-500 text-white px-2 py-1 rounded-">
          Logout
        </button>
      </div>
    </div>
  );
}
