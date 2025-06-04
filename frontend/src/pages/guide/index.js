import React, { useState, useEffect } from "react";
import Image from 'next/image';
import Link from 'next/link';
import { Book, Leaf, ShoppingCart, Shield, HelpCircle, Menu, X, Sun, Moon, Volume2, VolumeX } from "lucide-react";

const DocumentSection = ({ title, children, icon: Icon, content }) => {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [speech, setSpeech] = useState(null);
  
    useEffect(() => {
      // Initialize speech synthesis only on client side
      if (typeof window !== 'undefined') {
        setSpeech(window.speechSynthesis);
      }
    }, []);
    
    const handleSpeak = () => {
      if (!speech) return;
  
      if (isSpeaking) {
        speech.cancel();
        setIsSpeaking(false);
        return;
      }
  
      // Get all text content from the section
      const textToSpeak = document.getElementById(title).textContent;
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      
      utterance.onend = () => setIsSpeaking(false);
      
      speech.speak(utterance);
      setIsSpeaking(true);
    };

  return (
    <section className="mb-8 p-6 bg-[#F5F5F0] rounded-lg shadow-sm" id={title}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {Icon && <Icon className="text-[#0B513B]" size={24} />}
          <h2 className="text-2xl font-semibold text-[#0B513B]">{title}</h2>
        </div>
        <button
          onClick={handleSpeak}
          className="p-2 hover:bg-[#0B513B]/10 rounded-full transition-colors duration-300"
          aria-label={isSpeaking ? "Stop speaking" : "Start speaking"}
        >
          {isSpeaking ? (
            <VolumeX className="text-[#0B513B]" size={20} />
          ) : (
            <Volume2 className="text-[#0B513B]" size={20} />
          )}
        </button>
      </div>
      {children}
    </section>
  );
};

const Documentation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setScrolled(offset > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      // Cancel any ongoing speech when component unmounts
      window.speechSynthesis.cancel();
    };
  }, []);

  const theme = {
    dark: {
      bg: 'bg-[#0B513B]',
      cardBg: 'bg-[#F5F5F0]',
      text: 'text-white',
      secondaryText: 'text-green-200',
      headerBg: 'bg-[#094732]/95',
      button: 'bg-green-100 hover:bg-green-200 text-[#0B513B]',
      footer: 'bg-[#094732]'
    },
    light: {
      bg: 'bg-white',
      cardBg: 'bg-gray-50',
      text: 'text-gray-900',
      secondaryText: 'text-green-600',
      headerBg: 'bg-green-600/95',
      button: 'bg-green-600 hover:bg-green-700 text-white',
      footer: 'bg-gray-800'
    }
  };

  const currentTheme = isDarkMode ? theme.dark : theme.light;

  return (
    <div className={`min-h-screen ${currentTheme.bg} text-gray-800`}>
      {/* Header */}
      <header className={`fixed w-full ${scrolled ? currentTheme.headerBg : `${currentTheme.headerBg} bg-opacity-50`} transition-all duration-500 z-50`}>
        {/* Header content remains the same... */}
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
              {["Guide", "Community"].map((item) => (
                <a
                  key={item}
                  href={`/${item.toLowerCase()}`}
                  className={`${currentTheme.text} hover:text-green-400 px-3 py-2 text-sm font-medium transition-colors duration-300`}
                >
                  {item}
                </a>
              ))}
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

        {/* Mobile menu remains the same... */}
        {isMenuOpen && (
          <div className="md:hidden animate-slideDown">
            <div className={`px-2 pt-2 pb-3 space-y-1 sm:px-3 ${currentTheme.headerBg}`}>
              {["Guide", "Aid", "Community"].map((item) => (
                <a
                  key={item}
                  href={`/${item.toLowerCase()}`}
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

      {/* Main Content */}
      <div className="pt-32 pb-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-8">
            {isDarkMode ? <Book className="text-white" size={32} /> : <Book className="text-gray-900" size={32} />}
            {isDarkMode ? <h1 className="text-3xl font-bold text-white">AgriChain Documentation</h1> : <h1 className="text-3xl font-bold text-gray-900 ">AgriChain Documentation</h1> }
          </div>

          <DocumentSection title="What is AgriChain?" icon={Leaf}>
            <p className="text-gray-700 leading-relaxed">
              AgriChain is a blockchain-powered platform designed to bring transparency, security, 
              and efficiency to the agricultural supply chain. Our platform helps farmers:
            </p>
            <ul className="mt-4 space-y-2">
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#0B513B] rounded-full" />
                <span>Manage and track agricultural products</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#0B513B] rounded-full" />
                <span>Connect directly with customers</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#0B513B] rounded-full" />
                <span>Access crowdfunding opportunities</span>
              </li>
            </ul>
          </DocumentSection>

          <DocumentSection title="Getting Started" icon={ShoppingCart}>
            <div className="space-y-4">
              <div className="p-4 bg-white rounded-lg">
                <h3 className="font-semibold mb-2">1. Set Up Your Wallet</h3>
                <p>Download and install <a href="https://metamask.io/" 
                  className="text-[#0B513B] font-medium hover:underline">Metamask</a> to get started.</p>
              </div>
              
              <div className="p-4 bg-white rounded-lg">
                <h3 className="font-semibold mb-2">2. Connect Your Wallet</h3>
                <p>Add Sepolia ETH to your wallet and connect it to AgriChain.</p>
              </div>
              
              <div className="p-4 bg-white rounded-lg">
                <h3 className="font-semibold mb-2">3. Register Your Farm</h3>
                <p>Complete your profile and start managing your agricultural products.</p>
              </div>
            </div>
          </DocumentSection>

        <DocumentSection title="Using the Platform" icon={ShoppingCart}>
          <div className="space-y-4">
            <p className="text-gray-700">
              Farmers can register their farms, list products, and participate in the marketplace. 
              Users can also engage in crowdfunding campaigns to support agricultural projects.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-white rounded-lg">
                <h3 className="font-semibold mb-2">Farm Registration</h3>
                <p>Register and verify your farm details</p>
              </div>
              <div className="p-4 bg-white rounded-lg">
                <h3 className="font-semibold mb-2">Product Listing</h3>
                <p>List and manage your agricultural products</p>
              </div>
              <div className="p-4 bg-white rounded-lg">
                <h3 className="font-semibold mb-2">Marketplace</h3>
                <p>Connect with customers and sell your products</p>
              </div>
              <div className="p-4 bg-white rounded-lg">
                <h3 className="font-semibold mb-2">Crowdfunding</h3>
                <p>Create or participate in funding campaigns</p>
              </div>
            </div>
          </div>
        </DocumentSection>

        <DocumentSection title="Security & Best Practices" icon={Shield}>
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg">
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#0B513B] rounded-full" />
                  <span>Never share your private key or wallet seed phrase</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#0B513B] rounded-full" />
                  <span>Always verify transaction details before approval</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#0B513B] rounded-full" />
                  <span>Keep your wallet software updated</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#0B513B] rounded-full" />
                  <span>Use strong passwords for your accounts</span>
                </li>
              </ul>
            </div>
          </div>
        </DocumentSection>

        <DocumentSection title="FAQs & Support" icon={HelpCircle}>
          <div className="space-y-4">
            <p className="text-gray-700">
              Need help? We're here to assist you with any questions or concerns.
            </p>
            <div className="flex flex-col md:flex-row gap-4">
              <a href="/support" 
                className="flex-1 p-4 bg-white rounded-lg hover:bg-gray-50 transition-colors">
                <h3 className="font-semibold mb-2">Support Center</h3>
                <p className="text-gray-600">Visit our help center for guides and tutorials</p>
              </a>
              <a href="/contact" 
                className="flex-1 p-4 bg-white rounded-lg hover:bg-gray-50 transition-colors">
                <h3 className="font-semibold mb-2">Contact Us</h3>
                <p className="text-gray-600">Get in touch with our support team</p>
              </a>
            </div>
          </div>
        </DocumentSection>
        </div>
      </div>
    </div>
  );
};

export default Documentation;