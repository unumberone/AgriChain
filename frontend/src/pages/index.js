import { useState } from "react";
import Header from "../components/home/Header";
import DashboardPreview from "../components/home/DashboardPreview";
import Hero from "../components/home/Hero";
import Features from "../components/home/Features";
import Footer from "../components/home/Footer";

export default function LandingPage() {
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Theme colors
  const theme = {
    dark: {
      bg: "bg-[#0B513B]",
      cardBg: "bg-[#F5F5F0]",
      text: "text-white",
      secondaryText: "text-green-200",
      headerBg: "bg-[#094732]/95",
      button: "bg-green-100 hover:bg-green-200 text-[#0B513B]",
      footer: "bg-[#094732]",
    },
    light: {
      bg: "bg-white",
      cardBg: "bg-gray-50",
      text: "text-gray-900",
      secondaryText: "text-green-600",
      headerBg: "bg-green-600/95",
      button: "bg-green-600 hover:bg-green-700 text-white",
      footer: "bg-gray-800",
    },
  };

  const currentTheme = isDarkMode ? theme.dark : theme.light;

  return (
    <div className={`min-h-screen ${currentTheme.bg} transition-colors duration-500`}>
      <Header isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} currentTheme={currentTheme} />
      <Hero currentTheme={currentTheme} isDarkMode={isDarkMode} />
      <Features currentTheme={currentTheme} isDarkMode={isDarkMode} />
      <DashboardPreview isDarkMode={isDarkMode} />
      <Footer currentTheme={currentTheme} />
    </div>
  );
}
