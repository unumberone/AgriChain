// components/Navbar.js
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";

export default function Navbar() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed w-full bg-gray-900 ${
        scrolled ? "shadow-md" : "bg-opacity-50"
      } transition-all duration-500 z-50`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo + Branding */}
          <div className="flex items-center space-x-2">
            <Image src="/images/logo.png" alt="AgriChain Logo" width={30} height={30} priority />
            <span className="text-2xl font-bold text-white hover:scale-105 transition-transform duration-300">
              AgriChain
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {["Guide", "Shop"].map((item) => (
              <button
                key={item}
                onClick={() => router.push(`/consumer/${item.toLowerCase()}`)}
                className="text-white hover:text-green-400 px-3 py-2 text-sm font-medium transition-colors duration-300"
              >
                {item}
              </button>
            ))}
          </nav>

          {/* Mobile Navigation Toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:text-green-400 transition-colors duration-300"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden animate-slideDown">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-900">
            {["Guide", "Shop"].map((item) => (
              <a
                key={item}
                href={`/${item.toLowerCase()}`}
                className="block px-3 py-2 text-base font-medium text-white hover:text-green-400 transition-colors duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
