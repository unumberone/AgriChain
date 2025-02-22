import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import {
  Menu,
  X,
  Sun,
  Moon,
  Cloud,
  CloudSun,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudSnow,
  Cloudy
} from 'lucide-react';
import GoogleTranslate from "@/components/common/googleTranslate";

const getWeatherIcon = (description) => {
  switch (description?.toLowerCase()) {
    case 'clear sky':
    case 'mostly clear':
      return <Sun className="h-6 w-6 text-yellow-400" />;
    case 'partly cloudy':
      return <CloudSun className="h-6 w-6 text-yellow-500" />;
    case 'overcast':
      return <Cloudy className="h-6 w-6 text-gray-500" />;
    case 'foggy':
    case 'dense fog':
      return <CloudFog className="h-6 w-6 text-gray-400" />;
    case 'light drizzle':
    case 'moderate drizzle':
    case 'heavy drizzle':
      return <CloudDrizzle className="h-6 w-6 text-blue-400" />;
    case 'light rain':
    case 'moderate rain':
    case 'heavy rain':
    case 'light rain showers':
    case 'moderate rain showers':
    case 'heavy rain showers':
      return <CloudRain className="h-6 w-6 text-blue-600" />;
    case 'light snowfall':
    case 'moderate snowfall':
    case 'heavy snowfall':
      return <CloudSnow className="h-6 w-6 text-blue-300" />;
    default:
      return <Cloud className="h-6 w-6 text-gray-600" />;
  }
};

const AIInsights = () => {
  const router = useRouter();

  // Navbar states
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setScrolled(offset > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Theme settings
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

  // Data fetching states for AI Insights
  const [weather, setWeather] = useState(null);
  const [farmerInsights, setFarmerInsights] = useState(null);
  const [productInsights, setProductInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const selectedProducts = ["Tomato", "Carrot"];
  const location = "Coimbatore";

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch(`http://localhost:${process.env.API_PORT || 5000}/api/data/weather?location=${location}`);
        if (!response.ok) {
          throw new Error('Failed to fetch weather data');
        }
        const data = await response.json();
        setWeather(data);
      } catch (error) {
        console.error('Error fetching weather:', error);
        setError(error.message);
      }
    };

    const fetchFarmerInsights = async () => {
      try {
        const response = await fetch(`http://localhost:${process.env.API_PORT || 5000}/api/data/farmerInsights`);
        if (!response.ok) {
          throw new Error('Failed to fetch farmer insights');
        }
        const data = await response.json();
        setFarmerInsights(data.summary);
      } catch (error) {
        console.error('Error fetching farmer insights:', error);
      }
    };

    const fetchProductInsights = async () => {
      try {
        const response = await fetch(`http://localhost:${process.env.API_PORT || 5000}/api/data/productInsights`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            products: selectedProducts,
            location: location
          })
        });

        if (!response.ok) {
          throw new Error('Failed to fetch product insights');
        }

        const data = await response.json();
        setProductInsights(data.insights);
      } catch (error) {
        console.error('Error fetching product insights:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
    fetchFarmerInsights();
    fetchProductInsights();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-emerald-900 text-white">
        <h1 className="text-4xl font-semibold animate-pulse">Fetching latest AI Insights...</h1>
      </div>
    );
  }

  if (error || !weather || !weather.forecast || weather.forecast.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 text-red-500 text-lg font-semibold">
        Failed to load weather data.
      </div>
    );
  }

  return (
    <>
      {/* Navbar */}
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
              {["Guide", "Aid", "Community"].map((item) => (
                <button
                  key={item}
                  onClick={() => router.push(`/${item.toLowerCase()}`)}
                  className={`${currentTheme.text} hover:text-green-400 px-3 py-2 text-sm font-medium transition-colors duration-300`}
                >
                  {item}
                </button>
              ))}

              {/* Google Translate Dropdown */}
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
              {["Guide", "Aid", "Community"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className={`block px-3 py-2 text-base font-medium ${currentTheme.text} hover:text-green-400 transition-colors duration-300`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        )}
      </header>

      <div className="pt-24 min-h-screen bg-emerald-900 p-6 text-white flex flex-col">
        {/* Main Title */}
        <h1 className="text-4xl font-bold mb-10 self-center">AI Insights</h1>

        {/* Weather Section */}
        <h2 className="text-3xl font-semibold mb-4">7 Day Forecast</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3 w-full">
          {weather.forecast.slice(0, 7).map((day, index) => (
            <div key={index} className="bg-stone-100 p-4 rounded-lg shadow-md text-black flex flex-col items-center w-full">
              {getWeatherIcon(day.description)}
              <p className="text-sm font-semibold">{day.date}</p>
              <p className="text-gray-600 text-xs">{day.description}</p>
              <p className="font-semibold text-lg">{day.max_temp}°C</p>
            </div>
          ))}
        </div>

        {/* Farmer Insights Section */}
        <h2 className="text-3xl font-semibold mt-10 mb-4">Farmer Insights</h2>
        <div className="bg-stone-100 p-4 rounded-lg shadow-md text-black">
          <p className="text-lg">{farmerInsights || "No insights available."}</p>
        </div>

        {/* Product Insights Section */}
        <h2 className="text-3xl font-semibold mt-10 mb-4">Product Insights</h2>
        <div className="bg-stone-100 p-4 rounded-lg shadow-md text-black">
          <p className="text-lg">{productInsights || "No insights available."}</p>
        </div>
      </div>
    </>
  );
};

export default AIInsights;
