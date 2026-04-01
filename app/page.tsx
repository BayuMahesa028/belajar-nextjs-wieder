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
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm">

        <h1 className="text-2xl font-bold text-center mb-6">
          Login
        </h1>

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
  );
}