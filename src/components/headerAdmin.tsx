"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

interface HeaderAdminProps {
    user: any;
    handleLogout: () => void;
    isMenuOpen: boolean;
}

export default function HeaderAdmin({
    user,
    handleLogout,
    isMenuOpen,
}: HeaderAdminProps) {
    const router = useRouter();

    return (
        <header className="bg-white/90 backdrop-blur-md shadow-xl sticky top-0 z-50 border-b border-orange-200/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 md:h-20">
                    {/* Logo */}
                    <div
                        className="text-xl md:text-2xl font-black bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent cursor-pointer"
                        onClick={() => router.push("/")}
                    >
                        🛍️ MarbayStore
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center space-x-6">
                        {[
                            { label: "Table User", href: "/jumlahUserAdmin" },
                            { label: "Table Barang", href: "/jumlahBarangAdmin" },
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

                    {/* User Actions */}
                    <div className="hidden md:flex items-center gap-4">
                        <div className="flex items-center gap-2 bg-orange-100/80 px-3 py-1.5 rounded-xl text-sm font-bold text-slate-800 border border-orange-200">
                            <span className="w-7 h-7 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white text-xs">
                                {user.nama_lengkap?.charAt(0)?.toUpperCase()}
                            </span>
                            <span className="hidden lg:inline">
                                Hi, {user.nama_lengkap}
                            </span>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="px-5 py-2 bg-gradient-to-r from-red-500 to-orange-600 text-white font-bold rounded-xl text-sm shadow-md hover:scale-105 transition-transform"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
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
    );
}