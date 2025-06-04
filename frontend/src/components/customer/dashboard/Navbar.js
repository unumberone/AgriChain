import { Menu, X, User2, LogOut } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Image from "next/image";

export default function Navbar() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Get user info from localStorage
  const [user, setUser] = useState(null);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const u = localStorage.getItem("user");
      if (u) setUser(JSON.parse(u));
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showDropdown]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/login');
  };

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
                onClick={() => router.push(`/customer/${item.toLowerCase()}`)}
                className="text-white hover:text-green-400 px-3 py-2 text-sm font-medium transition-colors duration-300"
              >
                {item}
              </button>
            ))}
            {/* User Icon with Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown((v) => !v)}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-700 hover:bg-emerald-800 transition-colors"
                aria-label="Account"
              >
                <User2 className="text-white" size={22} />
              </button>
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-3 z-50 animate-fadeIn">
                  <div className="px-4 py-2 border-b">
                    <div className="font-semibold text-emerald-900">
                      {user?.name || "User"}
                    </div>
                    <div className="text-sm text-gray-600 break-all">
                      {user?.email}
                    </div>
                  </div>
                  <div className="px-4 py-2 flex items-center justify-between">
                    <span className="text-gray-700 text-sm">Wallet Balance:</span>
                    <span className="font-bold text-emerald-700">
                      {typeof user?.balance === "number"
                        ? user.balance.toLocaleString("en-US") + " VND"
                        : "--"}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 mt-2 text-red-600 hover:bg-gray-100 transition-colors text-left"
                  >
                    <LogOut size={18} /> Logout
                  </button>
                </div>
              )}
            </div>
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
                href={`/customer/${item.toLowerCase()}`}
                className="block px-3 py-2 text-base font-medium text-white hover:text-green-400 transition-colors duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                {item}
              </a>
            ))}
            {/* User Icon with Dropdown for mobile */}
            <div className="border-t border-gray-700 mt-2 pt-2">
              <button
                onClick={() => setShowDropdown((v) => !v)}
                className="flex items-center gap-2 px-3 py-2 text-white hover:text-green-400 transition-colors"
              >
                <User2 size={20} /> Account
              </button>
              {showDropdown && (
                <div className="bg-white rounded-lg shadow-lg py-3 mt-2 animate-fadeIn">
                  <div className="px-4 py-2 border-b">
                    <div className="font-semibold text-emerald-900">
                      {user?.name || "User"}
                    </div>
                    <div className="text-sm text-gray-600 break-all">
                      {user?.email}
                    </div>
                  </div>
                  <div className="px-4 py-2 flex items-center justify-between">
                    <span className="text-gray-700 text-sm">Wallet Balance:</span>
                    <span className="font-bold text-emerald-700">
                      {typeof user?.balance === "number"
                        ? user.balance.toLocaleString("en-US") + " VND"
                        : "--"}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 mt-2 text-red-600 hover:bg-gray-100 transition-colors text-left"
                  >
                    <LogOut size={18} /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}