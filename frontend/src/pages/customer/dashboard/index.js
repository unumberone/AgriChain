import React, { useEffect, useState } from 'react';
import { Search, ShoppingBag, Clock, Star } from 'lucide-react';
import Navbar from '@/components/customer/dashboard/Navbar';
import { useRouter } from 'next/router';

const Dashboard = () => {
  const [recentOrders, setRecentOrders] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [stats, setStats] = useState({ totalOrders: 0, activeOrders: 0, savedProducts: 0 });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

        // Lấy lịch sử đơn hàng thực tế
        const resOrders = await fetch(`${BASE_URL}/orders/${user?._id}`);
        const orders = await resOrders.json();

        // Lấy sản phẩm nổi bật thực tế
        const resProducts = await fetch(`${BASE_URL}/products/listAll`);
        const allProducts = await resProducts.json();
        // Giả sử sản phẩm nổi bật là sản phẩm có rating cao nhất
        const sortedProducts = (allProducts.products || []).sort((a, b) => (b.rating || 0) - (a.rating || 0));
        const featured = sortedProducts.slice(0, 3);

        // Lấy sản phẩm đã lưu (nếu có API riêng thì thay thế)
        // Ở đây giả lập là chưa có nên để 0
        const savedProducts = [];

        // Recent Orders: lấy 3 đơn gần nhất
        setRecentOrders(
          (orders || []).slice(-3).reverse().map((order) => ({
            id: order._id,
            product: order.products?.[0]?.name || order.products?.[0]?.product?.name || "Unknown",
            farmer: order.products?.[0]?.product?.farmer?.name || "Unknown",
            amount: `₫${Number(order.totalPrice).toLocaleString('vi-VN')}`,
            status: order.status
          }))
        );

        setFeaturedProducts(
          featured.map((product) => ({
            id: product._id,
            name: product.name,
            price: `₫${Number(product.price).toLocaleString('vi-VN')}/${product.unit}`,
            rating: product.rating || 4.5
          }))
        );

        setStats({
          totalOrders: (orders || []).length,
          activeOrders: (orders || []).filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled' && o.status !== 'Completed' && o.status !== 'success').length,
          savedProducts: savedProducts.length
        });
      } catch (err) {
        setRecentOrders([]);
        setFeaturedProducts([]);
        setStats({ totalOrders: 0, activeOrders: 0, savedProducts: 0 });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="min-h-screen bg-[#0B513B]">
      <Navbar />
      {/* Main Content */}
      <div className="max-w-7xl mx-auto pt-24 py-6 px-4">
        {/* Welcome Message */}
        <h1 className="text-white text-4xl font-bold text-center mb-6">Welcome to the customer Dashboard</h1>

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500">Total Orders</p>
                <p className="text-2xl font-bold">{loading ? '...' : stats.totalOrders}</p>
              </div>
              <ShoppingBag className="text-green-600" size={24} />
            </div>
          </div>
          {/* <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500">Active Orders</p>
                <p className="text-2xl font-bold">{loading ? '...' : stats.activeOrders}</p>
              </div>
              <Clock className="text-green-600" size={24} />
            </div>
          </div> */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500">Saved Products</p>
                <p className="text-2xl font-bold">{loading ? '...' : stats.savedProducts}</p>
              </div>
              <Star className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        {/* Recent Orders and Featured Products */}
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
          {/* Recent Orders */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Recent Orders</h2>
              <button
                className="text-green-700 hover:underline text-sm"
                onClick={() => router.push('/customer/historyOrder')}
              >
                View All
              </button>
            </div>
            <div className="space-y-4">
              {loading ? (
                <div className="text-gray-400">Loading...</div>
              ) : recentOrders.length === 0 ? (
                <div className="text-gray-400">No recent orders</div>
              ) : recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between border-b pb-4 cursor-pointer hover:bg-green-50 transition"
                  onClick={() => router.push('/customer/historyOrder')}
                >
                  <div>
                    <p className="font-medium">{order.product}</p>
                    {/* <p className="text-sm text-gray-500">Farmer: {order.farmer}</p> */}
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{order.amount}</p>
                    <p className="text-sm text-green-600">{order.status}</p>
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