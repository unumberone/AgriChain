const Hero = ({currentTheme, isDarkMode}) => {
  return (
      <section className="min-h-screen flex items-center justify-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <div className="text-center space-y-8 animate-fadeIn">
          <h1 className={`text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight ${currentTheme.text}`}>
            <span className="block animate-slideRight">Revolutionizing Agriculture</span>
            <span className={`block ${currentTheme.secondaryText} animate-slideLeft`}>
              with Blockchain Technology
            </span>
          </h1>
          <p className={`mt-3 max-w-md mx-auto text-lg sm:text-xl md:text-2xl ${isDarkMode ? 'text-green-100' : 'text-gray-600'} animate-fadeIn opacity-0 animation-delay-500`}>
            Connect, trade, and grow with the world's first decentralized agricultural marketplace.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8 animate-fadeIn opacity-0 animation-delay-700">
            <div className="rounded-md shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
              <a
                href="/register"
                className={`w-full flex items-center justify-center px-8 py-4 border border-transparent text-lg font-medium rounded-md ${currentTheme.button} transition-all duration-300`}
              >
                Get Started
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;