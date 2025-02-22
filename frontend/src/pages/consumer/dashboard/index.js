// pages/dashboard.js
import React from 'react';
import { Search, ShoppingBag, Clock, Star, Box, TrendingUp } from 'lucide-react';
import Navbar from '@/components/consumer/dashboard/Navbar';

const Dashboard = () => {
  const recentOrders = [
    { id: 1, product: 'Organic Rice', farmer: 'Ramesh Kumar', amount: '₹2,400', status: 'Delivered' },
    { id: 2, product: 'Fresh Tomatoes', farmer: 'Anita Patel', amount: '₹560', status: 'In Transit' },
    { id: 3, product: 'Wheat (10kg)', farmer: 'Suresh Singh', amount: '₹850', status: 'Processing' },
  ];

  const featuredProducts = [
    { id: 1, name: 'Organic Rice', price: '₹45/kg', rating: 4.8 },
    { id: 2, name: 'Fresh Tomatoes', price: '₹28/kg', rating: 4.5 },
    { id: 3, name: 'Organic Wheat', price: '₹32/kg', rating: 4.7 },
  ];

  return (
    <div className="min-h-screen bg-[#0B513B]">
    <Navbar />
    {/* Main Content */}
    <div className="max-w-7xl mx-auto pt-24 py-6 px-4">
      {/* Welcome Message */}
      <h1 className="text-white text-4xl font-bold text-center mb-6">Welcome to the Consumer Dashboard</h1>

      {/* Search Bar */}
      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Search for products, farmers, or categories..."
          className="w-full p-4 pl-12 rounded-lg border border-gray-200 focus:outline-none focus:border-green-500"
        />
        <Search className="absolute left-4 top-4 text-gray-400" />
      </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500">Total Orders</p>
                <p className="text-2xl font-bold">24</p>
              </div>
              <ShoppingBag className="text-green-600" size={24} />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500">Active Orders</p>
                <p className="text-2xl font-bold">3</p>
              </div>
              <Clock className="text-green-600" size={24} />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500">Saved Products</p>
                <p className="text-2xl font-bold">12</p>
              </div>
              <Star className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        {/* Recent Orders and Featured Products */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between border-b pb-4">
                  <div>
                    <p className="font-medium">{order.product}</p>
                    <p className="text-sm text-gray-500">Farmer: {order.farmer}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{order.amount}</p>
                    <p className="text-sm text-green-600">{order.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Featured Products */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Featured Products</h2>
            <div className="space-y-4">
              {featuredProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between border-b pb-4">
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-gray-500">{product.price}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Star className="text-yellow-400" size={16} />
                    <span>{product.rating}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;