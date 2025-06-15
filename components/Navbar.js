"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

export default function Navbar() {
  const pathname = usePathname();

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="bg-slate-400 border-b-8 border-b-slate-500 shadow-sm fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex h-16">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center space-x-8">
              <Link
                href="/"
                className={`text-gray-50 hover:text-gray-50 px-3 py-2 rounded-md ${
                  pathname === "/" ? "font-semibold" : ""
                }`}
              >
                <div className="w-8 h-8 relative">
                  <Image
                    src="/psi.png"
                    alt="Psi symbol"
                    fill
                    style={{ objectFit: "contain", filter: "brightness(0) invert(1)" }}
                    priority
                  />
                </div>
              </Link>
              <button
                onClick={() => scrollToSection("about")}
                className="text-slate-50 hover:text-slate-200 px-3 py-2 rounded-md transition-colors"
              >
                About Me
              </button>
              <button
                onClick={() => scrollToSection("hero")}
                className="text-slate-50 hover:text-slate-200 px-3 py-2 rounded-md transition-colors"
              >
                Contact
              </button>
              <button
                onClick={() => scrollToSection("calendar")}
                className="text-slate-50 hover:text-slate-200 px-3 py-2 rounded-md transition-colors"
              >
                Book Appointment
              </button>
              <button
                onClick={() => scrollToSection("map")}
                className="text-slate-50 hover:text-slate-200 px-3 py-2 rounded-md transition-colors"
              >
                Map
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
