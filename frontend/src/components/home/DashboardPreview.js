import React from 'react';
import Image from 'next/image';

const DashboardPreview = ({ isDarkMode }) => {
  const currentTheme = isDarkMode ? {
    bg: 'bg-[#0B513B]',
    text: 'text-white',
    secondaryText: 'text-green-200'
  } : {
    bg: 'bg-white',
    text: 'text-gray-900',
    secondaryText: 'text-green-600'
  };

  return (
    <section className={`py-32 ${currentTheme.bg}`} id="dashboard-preview">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 animate-fadeIn">
            <h2 className={`text-4xl sm:text-5xl font-extrabold ${currentTheme.text}`}>
              Powerful Dashboard for Smart Farming
            </h2>
            <p className={`text-xl ${isDarkMode ? 'text-green-100' : 'text-gray-600'}`}>
              Get real-time insights, manage your farm operations, and track market trends all in one place. Our intuitive dashboard puts the power of blockchain technology at your fingertips.
            </p>
            <ul className={`space-y-4 ${isDarkMode ? 'text-green-100' : 'text-gray-600'}`}>
              <li className="flex items-center space-x-3">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                <span>Real-time market analytics and pricing</span>
              </li>
              <li className="flex items-center space-x-3">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                <span>Weather insights and farming recommendations</span>
              </li>
              <li className="flex items-center space-x-3">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                <span>Inventory and supply chain management</span>
              </li>
            </ul>
          </div>
          
          <div className="relative group animate-slideLeft">
            <div className={`rounded-xl overflow-hidden shadow-2xl transform transition-transform duration-500 group-hover:scale-105 ${isDarkMode ? 'bg-[#F5F5F0]' : 'bg-white'}`}>
              <Image 
                src="/images/DashboardPreview.png" 
                alt="Farmer Dashboard Preview" 
                width={800} // Set appropriate width
                height={600} // Set appropriate height
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardPreview;
