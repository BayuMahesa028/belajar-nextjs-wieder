"use client";

import { useRouter } from "next/navigation";
import Button from "../src/components/button";

export default function Home() {
  const router = useRouter();

  const handleLogin = () => {
    router.push("/homeUser");
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-4xl flex overflow-hidden">
        {/* LEFT SIDE (Logo + Nama Web) */}
        <div className="w-1/2 bg-blue-600 text-white flex flex-col items-center justify-center p-8">
          {/* Logo */}
          <img
            src="/logo.png" // taruh file logo di public/logo.png
            alt="Logo"
            className="w-24 h-24 mb-4"
          />

          {/* Nama Web */}
          <h1 className="text-3xl font-bold text-center">CodeLogicCraft</h1>

          <p className="text-sm mt-2 text-center opacity-80">
            Belajar coding jadi lebih seru 🚀
          </p>
        </div>

        {/* RIGHT SIDE (Form Login) */}
        <div className="w-1/2 p-8">
          <h1 className="text-2xl font-bold text-center mb-6">Login</h1>

          <form className="space-y-4">
            <input
              type="text"
              placeholder="Username"
              className="w-full p-2 border rounded-lg"
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full p-2 border rounded-lg"
            />

            <div className="flex justify-between text-sm text-gray-600">
              <span className="cursor-pointer hover:text-blue-500">
                Lupa password?
              </span>
              <span className="cursor-pointer hover:text-blue-500">
                Register
              </span>
            </div>

            <Button text="Login" onClick={handleLogin} />
          </form>
        </div>
      </div>
    </div>
  );
}
