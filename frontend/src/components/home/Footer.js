import { Twitter, Instagram, Linkedin, Mail, PhoneCall } from 'lucide-react';

const Footer = ({ currentTheme }) => {
  return (
    <footer className={`${currentTheme.footer} transition-colors duration-500`}>
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Branding */}
          <div className="animate-fadeIn">
            <span className="text-2xl font-bold text-white">AgriChain</span>
            <p className="mt-2 text-gray-300">
              Transforming agriculture through blockchain technology.
            </p>
          </div>

          {/* Contact Us */}
          <div className="animate-fadeIn animation-delay-200">
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
              Contact Us
            </h3>
            <div className="mt-4 space-y-2">
              <a 
                href="mailto:contact@agrichain.com" 
                className="flex items-center text-base text-gray-300 hover:text-green-400 transition-colors duration-300"
              >
                <Mail className="w-5 h-5 mr-2" />
                contact@agrichain.com
              </a>
              <a 
                href="tel:+5551234567" 
                className="flex items-center text-base text-gray-300 hover:text-green-400 transition-colors duration-300"
              >
                <PhoneCall className="w-5 h-5 mr-2" />
                (555) 123-4567
              </a>
            </div>
          </div>

          {/* Social Media Links */}
          <div className="animate-fadeIn animation-delay-400">
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
              Follow Us
            </h3>
            <div className="mt-4 flex space-x-6">
              {[Twitter, Instagram, Linkedin].map((Icon, index) => (
                <a 
                  key={index} 
                  href="#" 
                  className="text-gray-400 hover:text-green-400 transition-colors duration-300"
                >
                  <Icon className="w-6 h-6" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 border-t border-gray-700 pt-8">
          <p className="text-base text-gray-400 text-center">
            © 2025 AgriChain. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;