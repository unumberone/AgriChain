import React, { useState, useEffect } from 'react';
import { Menu, X, Sun, Moon, ArrowUpRight, Cloud, ShoppingBag, Clock, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import ChartComponent from "@/components/dashboard/ChartComponent";
import { useRouter } from 'next/router';
import GoogleTranslate from "@/components/common/googleTranslate";
import {
  CloudSun,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudSnow,
  Cloudy
} from 'lucide-react';
import useWallet from "../../hooks/useWallet";

const isToday = (date) => {
  const today = new Date();
  return (
    date &&
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

const OPEN_WEATHER_API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;

// Weather reminder in English
function getWeatherReminder(weather, date) {
  if (!weather) return "Always monitor the weather to better care for your crops!";
  const hour = date ? new Date(date).getHours() : new Date().getHours();
  const desc = weather.description?.toLowerCase() || "";

  if (desc.includes("rain")) {
    if (hour >= 5 && hour < 11) return "It's raining this morning, remember to check your field's drainage system!";
    if (hour >= 11 && hour < 17) return "Rain is expected this afternoon, avoid spraying pesticides and harvesting.";
    return "It's raining, make sure your crops are not waterlogged.";
  }
  if (desc.includes("clear")) {
    if (hour >= 5 && hour < 11) return "Nice sunny weather, good for watering and pest inspection.";
    if (hour >= 11 && hour < 17) return "Strong sunlight, avoid working outdoors at noon.";
    return "Clear skies, check your automatic irrigation system.";
  }
  if (desc.includes("cloud")) {
    if (hour >= 5 && hour < 11) return "Cloudy morning, comfortable temperature for crop growth.";
    if (hour >= 11 && hour < 17) return "Cloudy afternoon, good time for weeding or fertilizing.";
    return "Cloudy weather, pay attention to soil moisture for your crops.";
  }
  if (desc.includes("fog")) {
    return "Foggy conditions, avoid spraying and be careful when moving around.";
  }
  if (desc.includes("snow")) {
    return "Snow detected, protect your crops from the cold!";
  }
  if (desc.includes("drizzle")) {
    return "Light drizzle, good time to check for pests on leaves.";
  }
  return "Monitor the weather to take care of your crops effectively!";
}

const Dashboard = () => {
  const router = useRouter();
  const { account, connectWallet } = useWallet();
  const [date, setDate] = useState(new Date());
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [aiInsights, setAiInsights] = useState('Fetching Latest AI Insights...');
  const [farmerTip, setFarmerTip] = useState('Welcome to AgriChain!');
  const [tipLength, setTipLength] = useState(0);
  const [weather, setWeather] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Real product state
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

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
  }, []);

  useEffect(() => {
    const handleStorage = () => {
      setIsLoggedIn(!!localStorage.getItem("user"));
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const response = await fetch(`http://localhost:${process.env.API_PORT || 5000}/api/data/farmerInsights`);
        if (!response.ok) throw new Error('Failed to fetch insights');
        const data = await response.json();
        setAiInsights(data.summary);
      } catch (error) {
        setAiInsights('Unable to load insights. Please try again later.');
      }
    };

    fetchInsights();
  }, []);

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

  // Weather: get by current location using OpenWeather API
  useEffect(() => {
    const fetchWeather = async (lat, lon) => {
      try {
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPEN_WEATHER_API_KEY}&units=metric`;
        const response = await fetch(url);
        const data = await response.json();
        if (data && data.weather && data.weather.length > 0) {
          setWeather({
            description: data.weather[0].description,
            max_temp: data.main.temp_max,
            min_temp: data.main.temp_min,
            temp: data.main.temp,
            icon: data.weather[0].icon
          });
        }
      } catch (error) {
        // ignore
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          fetchWeather(latitude, longitude);
        },
        () => {
          // fallback: Ho Chi Minh City
          fetchWeather(10.762622, 106.660172);
        }
      );
    } else {
      fetchWeather(10.762622, 106.660172);
    }
  }, []);

  // Fetch real products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      setLoadingProducts(true);
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
        const res = await fetch(`${BASE_URL}/products/list`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ farmer: user?._id })
        });
        const data = await res.json();
        if (res.ok) {
          setProducts(data.products || []);
        } else {
          setProducts([]);
        }
      } catch (err) {
        setProducts([]);
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchProducts();
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
    router.push("/login");
  };

  const cardClasses = "transition-all duration-300 hover:shadow-lg hover:scale-[1.02] cursor-pointer";

  const getWeatherIcon = (description) => {
    switch (description?.toLowerCase()) {
      case 'clear sky':
      case 'mostly clear':
        return <Sun className="h-6 w-6" />;
      case 'partly cloudy':
        return <CloudSun className="h-6 w-6" />;
      case 'overcast':
        return <Cloudy className="h-6 w-6" />;
      case 'foggy':
      case 'dense fog':
        return <CloudFog className="h-6 w-6" />;
      case 'light drizzle':
      case 'moderate drizzle':
      case 'heavy drizzle':
        return <CloudDrizzle className="h-6 w-6" />;
      case 'light rain':
      case 'moderate rain':
      case 'heavy rain':
      case 'light rain showers':
      case 'moderate rain showers':
      case 'heavy rain showers':
        return <CloudRain className="h-6 w-6" />;
      case 'light snowfall':
      case 'moderate snowfall':
      case 'heavy snowfall':
        return <CloudSnow className="h-6 w-6" />;
      default:
        return <Cloud className="h-6 w-6" />;
    }
  };

  // Format quantity and VND currency
  const formatQuantity = (value, unit) =>
    `${Number(value).toLocaleString('en-US', { maximumFractionDigits: 2 })} ${unit}`;
  const formatCurrency = (value) =>
    Number(value).toLocaleString('en-US', { style: 'currency', currency: 'VND' });

  return (
    <div className={`min-h-screen ${currentTheme.bg} transition-colors duration-500 pb-16`}>
      {/* Header with top navigation */}
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
            {/* Top navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => router.push("/myProducts/myProductLines")}
                className={`${currentTheme.text} hover:text-green-400 px-3 py-2 text-sm font-medium transition-colors duration-300`}
              >
                ProductLine
              </button>
              <button
                onClick={() => router.push("/guide")}
                className={`${currentTheme.text} hover:text-green-400 px-3 py-2 text-sm font-medium transition-colors duration-300`}
              >
                Guide
              </button>
              <button
                onClick={() => router.push("/community")}
                className={`${currentTheme.text} hover:text-green-400 px-3 py-2 text-sm font-medium transition-colors duration-300`}
              >
                Community
              </button>
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
              {isLoggedIn && (
                <button
                  onClick={handleLogout}
                  className={`${currentTheme.text} hover:text-red-500 px-3 py-2 text-sm font-medium transition-colors duration-300`}
                >
                  Logout
                </button>
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
            {/* Mobile menu */}
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
                ProductLine
              </button>
              <button
                onClick={() => {
                  router.push("/guide");
                  setIsMenuOpen(false);
                }}
                className={`block w-full text-left px-3 py-2 text-base font-medium ${currentTheme.text} hover:text-green-400 transition-colors duration-300`}
              >
                Guide
              </button>
              <button
                onClick={() => {
                  router.push("/community");
                  setIsMenuOpen(false);
                }}
                className={`block w-full text-left px-3 py-2 text-base font-medium ${currentTheme.text} hover:text-green-400 transition-colors duration-300`}
              >
                Community
              </button>
              {isLoggedIn && (
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className={`block w-full text-left px-3 py-2 text-base font-medium ${currentTheme.text} hover:text-red-500 transition-colors duration-300`}
                >
                  Logout
                </button>
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

            {/* Calendar Card */}
            <Card className={`bg-[#f4f1e7] p-6 flex-1 ${cardClasses}`}>
              <div className="flex gap-6">
                <div className="flex-none rounded-lg overflow-hidden">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className={`rounded-lg bg-black`}
                    classNames={{
                      months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                      month: "space-y-4",
                      caption: "flex justify-center pt-1 relative items-center text-white",
                      caption_label: "text-sm font-medium text-white",
                      nav: "space-x-1 flex items-center",
                      nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 text-white",
                      nav_button_previous: "absolute left-1",
                      nav_button_next: "absolute right-1",
                      table: "w-full border-collapse space-y-1",
                      head_row: "flex",
                      head_cell: "text-white rounded-md w-9 font-normal text-[0.8rem] text-center",
                      row: "flex w-full mt-2",
                      cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-white first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                      day: "h-9 w-9 p-0 font-normal text-white aria-selected:opacity-100",
                      day_selected: "bg-white text-black hover:bg-white hover:text-black focus:bg-white focus:text-black aria-selected:bg-white aria-selected:text-black"
                        + (isToday(date) ? " bg-green-500 text-white font-bold rounded-full" : ""),
                      day_today: "bg-green-500 text-white font-bold rounded-full",
                      day_outside: "text-gray-500 opacity-50",
                      day_disabled: "text-gray-500 opacity-50",
                      day_range_middle: "aria-selected:bg-gray-800 aria-selected:text-white",
                      day_hidden: "invisible",
                    }}
                  />
                </div>
                <div className="flex-1 pt-2">
                  {tasks.map((task, i) => (
                    <div key={i} className="flex justify-between items-center mb-3">
                      <span className="text-sm"><b>• {task.name}</b></span>
                      <span className="text-sm text-gray-600">{task.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column */}
          <div className="flex-1 flex flex-col gap-4">
            {/* Weather & Reminder Card */}
            <Card
              className={`bg-[#f4f1e7] p-6 ${cardClasses}`}
              onClick={() => handleCardClick('/aiInsights')}
            >
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                  {weather?.icon ? (
                    <img
                      src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
                      alt={weather.description}
                      className="h-8 w-8"
                    />
                  ) : getWeatherIcon(weather?.description)}
                  <span className="text-2xl font-bold">
                    {weather ? Math.round(weather.temp) : "--"}° C
                  </span>
                </div>
                <ArrowUpRight className="h-5 w-5" />
              </div>
              <div className="min-h-[80px]">
                <p className="text-gray-800 text-l leading-relaxed line-clamp-3">
                  {getWeatherReminder(weather, date)}
                </p>
              </div>
            </Card>

            {/* Products */}
            <Card
              className={`bg-[#f4f1e7] p-6 flex-1 ${cardClasses}`}
              onClick={() => handleCardClick('/myProducts')}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">MY PRODUCTS</h2>
                <ArrowUpRight className="h-5 w-5" />
              </div>
              <div className="space-y-4">
                {loadingProducts ? (
                  <div className="text-center text-gray-500 py-8">Loading products...</div>
                ) : products.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">No products in your inventory</div>
                ) : (
                  products.map((product, i) => (
                    <div key={product._id || i} className="flex items-center gap-4">
                      <img
                        src={product.image || '/api/placeholder/400/400'}
                        alt={product.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{product.name}</span>
                          {Number(product.quantity) <= 5 && (
                            <span className="text-red-500 text-sm">Stock Low!</span>
                          )}
                        </div>
                        <span className="text-lg">
                          {formatCurrency(product.price)} / {product.unit}
                        </span>
                        <div className="text-gray-600 text-sm">
                          {formatQuantity(product.quantity, product.unit)}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;