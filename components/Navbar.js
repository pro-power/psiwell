"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
    setIsMenuOpen(false); // Close menu after navigation
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex h-16">
          <div className="flex items-center justify-between w-full">
            {/* Logo */}
            <Link
              href="/"
              className={`text-gray-900 hover:text-gray-700 px-3 py-2 rounded-md transition-colors ${
                pathname === "/" ? "font-semibold" : ""
              }`}
            >
              <div className="w-8 h-8 relative">
                <Image
                  src="/psiwell.png"
                  alt="Psi Wellness Portal Logo"
                  fill
                  style={{
                    objectFit: "contain",
                  }}
                  priority
                />
              </div>
            </Link>

            {/* Desktop Navigation - Hidden on mobile */}
            <div className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => scrollToSection("about")}
                className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md transition-colors font-medium"
              >
                About Me
              </button>
              <button
                onClick={() => scrollToSection("calendar")}
                className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md transition-colors font-medium"
              >
                Book Appointment
              </button>
              <button
                onClick={() => scrollToSection("map")}
                className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md transition-colors font-medium"
              >
                Map
              </button>
            </div>

            {/* Hamburger Menu Button - Visible on mobile */}
            <button
              onClick={toggleMenu}
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-md text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-200"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu - Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
              <button
                onClick={() => scrollToSection("about")}
                className="block w-full text-left px-3 py-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-50 font-medium"
              >
                About Me
              </button>
              <button
                onClick={() => scrollToSection("calendar")}
                className="block w-full text-left px-3 py-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-50 font-medium"
              >
                Book Appointment
              </button>
              <button
                onClick={() => scrollToSection("map")}
                className="block w-full text-left px-3 py-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-50 font-medium"
              >
                Map
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
