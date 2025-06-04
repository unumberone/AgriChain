import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ArrowLeft, Search, Star } from 'lucide-react';

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const ShopPage = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Lấy sản phẩm thực từ API
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
        const res = await fetch(`${BASE_URL}/products/listAll`, {
          method: "GET",
          headers: { "Content-Type": "application/json" }
        });
        const data = await res.json();
        setProducts(data.products || []);
      } catch (err) {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.farmer?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-800 to-emerald-900">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            className="text-emerald-50 hover:text-white hover:bg-emerald-700/30"
            onClick={() => router.push('/admin/dashboard')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>

        <div className="mb-12 animate-slideRight">
          <h1 className="text-4xl font-bold text-white mb-2">Market</h1>
          <p className="text-emerald-100 text-lg">Support local farmers, buy fresh produce</p>
        </div>

        <div className="flex gap-4 mb-8">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                className="pl-10"
                placeholder="Search products or farmers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center text-white py-24 text-xl animate-pulse">Loading products...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product._id} className="overflow-hidden animate-fadeIn hover:scale-105">
                <div className="aspect-square relative">
                  <img
                    src={product.image || '/api/placeholder/400/400'}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-emerald-500 text-white px-2 py-1 rounded-full text-sm flex items-center">
                    <Star className="h-4 w-4 mr-1 fill-current" />
                    {product.rating || 4.5}
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold text-emerald-900">{product.name}</h3>
                    <div className="text-right">
                      <div className="text-lg font-bold text-emerald-700">₫{Number(product.price).toLocaleString('vi-VN')}</div>
                      <div className="text-sm text-emerald-600">per {product.unit}</div>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">{product.description}</p>
                  <div className="flex items-center mb-4">
                    <div className="text-sm text-emerald-700 mr-4">
                      <span className="font-medium">{product.farmer}</span>
                      <span className="text-gray-500"> · {product.location}</span>
                    </div>
                    <div className="bg-emerald-100 text-emerald-800 text-sm px-2 py-1 rounded">
                      {product.sustainabilityScore || 90}% Sustainable
                    </div>
                  </div>
                  <div className="mb-2 text-sm text-gray-700">
                    <b>Available:</b> {product.quantity ?? product.available ?? 0} {product.unit}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {!loading && filteredProducts.length === 0 && (
          <div className="text-center py-12 bg-white/5 rounded-lg backdrop-blur-sm">
            <div className="text-emerald-100 text-lg">No products found</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopPage;