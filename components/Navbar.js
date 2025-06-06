"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-slate-400 border-b-8 border-b-slate-500 shadow-sm fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex h-16">
          <div className="flex items-center justify-between w-full">
            <Link
              href="/"
              className={`text-gray-50 hover:text-gray-50 px-3 py-2 rounded-md ${
                pathname === "/" ? "font-semibold" : ""
              }`}
            >
              <i className="fa-solid fa-house"></i>
            </Link>
            <Link
              href="/dashboard"
              className={`text-slate-50 text-sm border border-slate-200 hover:border-slate-300 hover:text-slate-700 hover:bg-slate-100 px-4 py-2 rounded-lg ${
                pathname === "/dashboard" ? "font-semibold" : ""
              }`}
            >
              Dashboard
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
