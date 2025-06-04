import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, Sun, Moon, ArrowUpRight, TrendingUp, Trophy, User2, LogOut } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import ChartComponent from "@/components/dashboard/ChartComponent";
import { useRouter } from 'next/router';
import GoogleTranslate from "@/components/common/googleTranslate";
import useWallet from "../../../hooks/useWallet";

const isToday = (date) => {
  const today = new Date();
  return (
    date &&
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

const Dashboard = () => {
  const router = useRouter();
  const { account, connectWallet } = useWallet();
  const [date, setDate] = useState(new Date());
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [farmerTip, setFarmerTip] = useState('Welcome to AgriChain!');
  const [tipLength, setTipLength] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Dashboard stats
  const [revenue, setRevenue] = useState(0);
  const [topProductLine, setTopProductLine] = useState(null);

  // User dropdown
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setScrolled(offset > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsLoggedIn(typeof window !== "undefined" && !!localStorage.getItem("user"));
    if (typeof window !== "undefined") {
      const u = localStorage.getItem("user");
      if (u) setUser(JSON.parse(u));
    }
  }, []);

  useEffect(() => {
    const handleStorage = () => {
      setIsLoggedIn(!!localStorage.getItem("user"));
      const u = localStorage.getItem("user");
      if (u) setUser(JSON.parse(u));
      else setUser(null);
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

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

  useEffect(() => {
    const fetchTip = async () => {
      try {
        const response = await fetch(`http://localhost:${process.env.API_PORT || 5000}/api/data/farmerTip`);
        if (!response.ok) throw new Error('Failed to fetch tip');
        const data = await response.json();
        setFarmerTip(data.tip);
        setTipLength(data.tip.length);
      } catch (error) {
        setFarmerTip('Welcome to AgriChain!');
      }
    };

    fetchTip();
  }, []);

  // Lấy doanh thu và dòng sản phẩm bán chạy nhất từ API (giả định endpoint /api/admin/overview)
  useEffect(() => {
    const fetchAdminOverview = async () => {
      try {
        const response = await fetch(`http://localhost:${process.env.API_PORT || 5000}/api/admin/overview`);
        if (!response.ok) throw new Error('Failed to fetch overview');
        const data = await response.json();
        setRevenue(data.revenue || 0);
        setTopProductLine(data.topProductLine || null);
      } catch (error) {
        setRevenue(0);
        setTopProductLine(null);
      }
    };
    fetchAdminOverview();
  }, []);

  const theme = {
    dark: {
      bg: 'bg-gradient-to-b from-[#0B513B] to-[#000000]',
      cardBg: 'bg-[#F5F5F0]',
      text: 'text-white',
      secondaryText: 'text-green-200',
      headerBg: 'bg-[#0B513B]/95',
      button: 'bg-green-100 hover:bg-green-200 text-[#0B513B]',
      footer: 'bg-[#094732]'
    },
    light: {
      bg: 'bg-gradient-to-b from-white to-gray-100',
      cardBg: 'bg-gray-50',
      text: 'text-gray-900',
      secondaryText: 'text-green-600',
      headerBg: 'bg-gray-300/95',
      button: 'bg-green-600 hover:bg-green-700 text-white',
      footer: 'bg-gray-800'
    }
  };

  const currentTheme = isDarkMode ? theme.dark : theme.light;

  const tasks = [
    { name: "Check Irrigation System", time: "9:30 AM" },
    { name: "Fix Power in Godown", time: "2:00 PM" }
  ];

  const handleCardClick = (path) => {
    router.push(path);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
    router.push("/login");
  };

  const cardClasses = "transition-all duration-300 hover:shadow-lg hover:scale-[1.02] cursor-pointer";

  return (
    <div className={`min-h-screen ${currentTheme.bg} transition-colors duration-500 pb-16`}>
      {/* Header */}
      <header className={`fixed w-full ${scrolled ? currentTheme.headerBg : `${currentTheme.headerBg} bg-opacity-50`} transition-all duration-500 z-50`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center space-x-2">
              <Image 
                src="/images/logo.png" 
                alt="AgriChain Logo" 
                width={30} 
                height={30} 
                priority
              />
              <Link href="/dashboard">
                <span className={`text-2xl font-bold ${currentTheme.text} hover:scale-105 transition-transform duration-300`}>
                  AgriChain
                </span>
              </Link>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => router.push("/myProducts/myProductLines")}
                className={`${currentTheme.text} hover:text-green-400 px-3 py-2 text-sm font-medium transition-colors duration-300`}
              >
                Product Line
              </button>
              <button
                onClick={() => router.push("/admin/shop")}
                className={`${currentTheme.text} hover:text-green-400 px-3 py-2 text-sm font-medium transition-colors duration-300`}
              >
                Shop
              </button>
              {["Guide", "Community"].map((item) => (
                <button
                  key={item}
                  onClick={() => router.push(`/${item.toLowerCase()}`)}
                  className={`${currentTheme.text} hover:text-green-400 px-3 py-2 text-sm font-medium transition-colors duration-300`}
                >
                  {item}
                </button>
              ))}
              <div className="flex items-center">
                {account ? (
                  <span className={`px-3 py-1 ${currentTheme.button} rounded-md`}>
                    {account.slice(0, 6)}...{account.slice(-4)}
                  </span>
                ) : (
                  <button 
                    onClick={connectWallet} 
                    className={`${currentTheme.text} hover:text-green-400 px-3 py-2 text-sm font-medium transition-colors duration-300`}
                  >
                    Connect Wallet
                  </button>
                )}
              </div>
              {/* User dropdown */}
              {isLoggedIn && (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setShowDropdown((v) => !v)}
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-700 hover:bg-emerald-800 transition-colors ml-2"
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
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 mt-2 text-red-600 hover:bg-gray-100 transition-colors text-left"
                      >
                        <LogOut size={18} /> Logout
                      </button>
                    </div>
                  )}
                </div>
              )}
              <div className="flex items-center">
                <GoogleTranslate />
              </div>
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`p-2 rounded-full hover:bg-gray-200/20 transition-colors duration-300 ${currentTheme.text}`}
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </nav>
            <div className="md:hidden flex items-center space-x-4">
              {account ? (
                <span className={`px-3 py-1 ${currentTheme.button} rounded-md text-sm`}>
                  {account.slice(0, 6)}...{account.slice(-4)}
                </span>
              ) : (
                <button 
                  onClick={connectWallet} 
                  className={`px-3 py-1 ${currentTheme.button} rounded-md text-sm`}
                >
                  Connect
                </button>
              )}
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`p-2 rounded-full hover:bg-gray-200/20 transition-colors duration-300 ${currentTheme.text}`}
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`${currentTheme.text} hover:text-green-400 transition-colors duration-300`}
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden animate-slideDown">
            <div className={`px-2 pt-2 pb-3 space-y-1 sm:px-3 ${currentTheme.headerBg}`}>
              <button
                onClick={() => {
                  router.push("/myProducts/myProductLines");
                  setIsMenuOpen(false);
                }}
                className={`block w-full text-left px-3 py-2 text-base font-medium ${currentTheme.text} hover:text-green-400 transition-colors duration-300`}
              >
                Product Line
              </button>
              <button
                onClick={() => {
                  router.push("/admin/shop");
                  setIsMenuOpen(false);
                }}
                className={`block w-full text-left px-3 py-2 text-base font-medium ${currentTheme.text} hover:text-green-400 transition-colors duration-300`}
              >
                Shop
              </button>
              {["Guide", "Community"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className={`block px-3 py-2 text-base font-medium ${currentTheme.text} hover:text-green-400 transition-colors duration-300`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item}
                </a>
              ))}
              {/* User dropdown for mobile */}
              {isLoggedIn && (
                <div className="border-t border-gray-300 mt-2 pt-2">
                  <button
                    onClick={() => setShowDropdown((v) => !v)}
                    className="flex items-center gap-2 px-3 py-2 text-emerald-900 hover:text-green-600 transition-colors"
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
              )}
            </div>
          </div>
        )}
      </header>
      
      <main className="pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h1 
          className={`text-white font-bold mb-8 text-center transition-all duration-300 ${
            tipLength > 40 ? 'text-3xl' : 'text-4xl'
          }`}
        >
          {farmerTip}
        </h1>

        {/* Thông số tổng quan */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Card className="bg-[#f4f1e7] p-6 flex items-center gap-4">
            <TrendingUp className="text-green-600" size={32} />
            <div>
              <div className="text-gray-500">Total Revenue</div>
              <div className="text-2xl font-bold">
                {revenue ? `₫${Number(revenue).toLocaleString('vi-VN')}` : "--"}
              </div>
            </div>
          </Card>
          <Card className="bg-[#f4f1e7] p-6 flex items-center gap-4">
            <Trophy className="text-green-600" size={32} />
            <div>
              <div className="text-gray-500">Top Product Line (Quarter)</div>
              <div className="text-2xl font-bold">
                {topProductLine?.name || "--"}
              </div>
              {topProductLine?.totalSold && (
                <div className="text-green-700 text-sm">
                  Sold: {topProductLine.totalSold}
                </div>
              )}
            </div>
          </Card>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="flex-1 flex flex-col gap-4">
            {/* Sales Analytics Card */}
            <Card 
              className={`bg-[#f4f1e7] p-6 h-[300px] ${cardClasses}`}
              onClick={() => handleCardClick('/analytics')}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">SALES ANALYTICS</h2>
                <ArrowUpRight className="h-5 w-5" />
              </div>
              <div className="h-[220px] w-full">
                <ChartComponent />
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;