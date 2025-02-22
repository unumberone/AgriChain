import React from 'react';
import { Menu, X, Sun, Moon, ArrowUpRight, Cloud } from 'lucide-react';
import { useState, useEffect } from 'react';
import Image from 'next/image'
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import ChartComponent from "@/components/dashboard/ChartComponent";
import { useRouter } from 'next/router';
import GoogleTranslate from "@/components/common/googleTranslate";
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

const Dashboard = () => {
  const router = useRouter();
  const { account, connectWallet } = useWallet();
  const [date, setDate] = React.useState(new Date());
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [aiInsights, setAiInsights] = useState('Fetching Latest AI Insights...');
  const [farmerTip, setFarmerTip] = useState('Welcome to AgriChain!');
  const [tipLength, setTipLength] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setScrolled(offset > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const response = await fetch(`http://localhost:${process.env.API_PORT || 5000}/api/data/farmerInsights`);
        if (!response.ok) throw new Error('Failed to fetch insights');
        const data = await response.json();
        setAiInsights(data.summary);
      } catch (error) {
        console.error('Error fetching insights:', error);
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
        console.error('Error fetching tip:', error);
        setFarmerTip('Welcome to AgriChain!');
      }
    };

    fetchTip();
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
    { name: "Check Irrigaton System", time: "9:30 AM" },
    { name: "Fix Power in Godown", time: "2:00 PM" }
  ];

  const products = [
    { name: "Carrots (20 KG)", price: 565, image: "/api/placeholder/80/80" },
    { name: "Tomato (3 KG)", price: 74.25, image: "/api/placeholder/80/80", stockLow: true },
    { name: "Sunflower Seeds (7 KG)", price: 680.72, image: "/api/placeholder/80/80" }
  ];

  const handleCardClick = (path) => {
    router.push(path);
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
              <span className={`text-2xl font-bold ${currentTheme.text} hover:scale-105 transition-transform duration-300`}>
                AgriChain
              </span>
            </div>
            
            <nav className="hidden md:flex items-center space-x-8">
              {["Guide", "Shop", "Aid", "Community"].map((item) => (
                <button
                  key={item}
                  onClick={() => router.push(`/${item.toLowerCase()}`)}
                  className={`${currentTheme.text} hover:text-green-400 px-3 py-2 text-sm font-medium transition-colors duration-300`}
                >
                  {item}
                </button>
              ))}

              {/* Wallet Connection Button */}
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
              {/* Mobile Wallet Button */}
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
              {["Guide", "Shop", "Aid", "Community"].map((item) => (
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
            {/* AI Insights */}
            <Card 
              className={`bg-[#f4f1e7] p-6 ${cardClasses}`}
              onClick={() => handleCardClick('/aiInsights')}
            >
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                  <Cloud className="h-6 w-6" />
                  <span className="text-2xl font-bold">24° C</span>
                </div>
                <ArrowUpRight className="h-5 w-5" />
              </div>
              <div className="min-h-[80px]">
                <p className="text-gray-800 text-l leading-relaxed line-clamp-3">
                  {aiInsights}
                </p>
              </div>
            </Card>
            
            {/* Products */}
            <Card 
              className={`bg-[#f4f1e7] p-6 flex-1 ${cardClasses}`}
              onClick={() => handleCardClick('/products')}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">MY PRODUCTS</h2>
                <ArrowUpRight className="h-5 w-5" />
              </div>
              <div className="space-y-4">
                {products.map((product, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{product.name}</span>
                        {product.stockLow && (
                          <span className="text-red-500 text-sm">Stock Low!</span>
                        )}
                      </div>
                      <span className="text-lg">₹{product.price}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;