import { Shield, Coins, Users, Sprout } from 'lucide-react';

const Features = ({currentTheme, isDarkMode}) => {
    const features = [
        {
          title: "Blockchain Transparency",
          description: "Track your produce from farm to table with immutable blockchain records ensuring complete transparency.",
          Icon: Shield
        },
        {
          title: "Smart Pricing",
          description: "Get real-time market prices and automated smart contracts for fair, transparent transactions.",
          Icon: Coins
        },
        {
          title: "Community Collaboration",
          description: "Connect directly with farmers, distributors, and customers in a decentralized marketplace.",
          Icon: Users
        },
        {
          title: "Decentralized Crowdfunding",
          description: "Support agricultural projects through secure, blockchain-based crowdfunding initiatives.",
          Icon: Sprout
        }
      ];
    return(
      <section className={`py-32 ${currentTheme.bg}`} id="features">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className={`text-4xl sm:text-5xl font-extrabold ${currentTheme.text}`}>
              Powerful Features for Modern Agriculture
            </h2>
            <p className={`mt-4 text-xl ${isDarkMode ? 'text-green-100' : 'text-gray-600'}`}>
              Everything you need to manage and grow your agricultural business.
            </p>
          </div>

          <div className="mt-20">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, index) => (
                <div 
                  key={feature.title} 
                  className="group pt-6 opacity-0 animate-slideUp"
                  style={{ animationDelay: `${index * 200}ms`, animationFillMode: 'forwards' }}
                >
                  <div className={`flow-root ${currentTheme.cardBg} rounded-xl px-6 pb-8 h-full transform transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl`}>
                    <div className="-mt-6">
                      <div className={`inline-flex items-center justify-center p-3 ${isDarkMode ? 'bg-[#0B513B]' : 'bg-green-600'} rounded-xl shadow-lg transform -translate-y-6 transition-transform group-hover:-translate-y-8`}>
                        <feature.Icon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="mt-6 text-xl font-semibold text-gray-900">
                        {feature.title}
                      </h3>
                      <p className="mt-4 text-base text-gray-500">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
};

export default Features;