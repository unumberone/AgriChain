import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { ShoppingCart, ArrowLeft, Search, Filter, Star } from 'lucide-react';
import { toast, Toaster } from 'sonner';

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ShopPage = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [cart, setCart] = useState([]);

  const [products] = useState([
    {
      id: 1,
      name: 'Organic Carrots',
      price: 35,
      unit: 'KG',
      farmer: 'Rajesh Kumar',
      location: 'Maharashtra',
      rating: 4.8,
      sustainabilityScore: 92,
      available: 20,
      image: '/api/placeholder/400/400',
      description: 'Fresh organic carrots grown using sustainable farming practices.',
      tags: ['organic', 'vegetables', 'root-vegetables']
    },
    {
      id: 2,
      name: 'Fresh Tomatoes',
      price: 19,
      unit: 'KG',
      farmer: 'Priya Singh',
      location: 'Karnataka',
      rating: 4.5,
      sustainabilityScore: 88,
      available: 15,
      image: '/api/placeholder/400/400',
      description: 'Locally grown tomatoes, perfect for salads and cooking.',
      tags: ['fresh', 'vegetables']
    },
    {
      id: 3,
      name: 'Premium Sunflower Seeds',
      price: 60,
      unit: 'KG',
      farmer: 'Amit Patel',
      location: 'Gujarat',
      rating: 4.9,
      sustainabilityScore: 95,
      available: 50,
      image: '/api/placeholder/400/400',
      description: 'High-quality sunflower seeds from sustainable farms.',
      tags: ['organic', 'seeds']
    },
    {
      id: 4,
      name: 'Organic Rice',
      price: 50,
      unit: 'KG',
      farmer: 'Lakshmi Devi',
      location: 'Tamil Nadu',
      rating: 4.7,
      sustainabilityScore: 90,
      available: 100,
      image: '/api/placeholder/400/400',
      description: 'Premium organic rice grown using traditional farming methods.',
      tags: ['organic', 'grains', 'staples']
    },
    {
      id: 5,
      name: 'Fresh Spinach',
      price: 10,
      unit: 'KG',
      farmer: 'Mohammed Khan',
      location: 'Uttar Pradesh',
      rating: 4.6,
      sustainabilityScore: 87,
      available: 25,
      image: '/api/placeholder/400/400',
      description: 'Freshly harvested spinach leaves, rich in nutrients.',
      tags: ['fresh', 'vegetables', 'leafy-greens']
    },
    {
      id: 6,
      name: 'Organic Wheat Flour',
      price: 40,
      unit: 'KG',
      farmer: 'Gurpreet Singh',
      location: 'Punjab',
      rating: 4.8,
      sustainabilityScore: 89,
      available: 150,
      image: '/api/placeholder/400/400',
      description: 'Stone-ground organic wheat flour for perfect rotis and bread.',
      tags: ['organic', 'grains', 'staples']
    },
    {
      id: 7,
      name: 'Fresh Mangoes',
      price: 220,
      unit: 'KG',
      farmer: 'Anita Desai',
      location: 'Maharashtra',
      rating: 4.9,
      sustainabilityScore: 86,
      available: 30,
      image: '/api/placeholder/400/400',
      description: 'Sweet and juicy Alphonso mangoes, naturally ripened.',
      tags: ['fresh', 'fruits', 'seasonal']
    },
    {
      id: 8,
      name: 'Organic Turmeric',
      price: 350.00,
      unit: 'KG',
      farmer: 'Ramesh Iyer',
      location: 'Kerala',
      rating: 4.7,
      sustainabilityScore: 94,
      available: 40,
      image: '/api/placeholder/400/400',
      description: 'High-quality organic turmeric with rich color and aroma.',
      tags: ['organic', 'spices']
    },
    {
      id: 9,
      name: 'Fresh Green Peas',
      price: 60,
      unit: 'KG',
      farmer: 'Sanjay Verma',
      location: 'Himachal Pradesh',
      rating: 4.5,
      sustainabilityScore: 88,
      available: 35,
      image: '/api/placeholder/400/400',
      description: 'Mountain-grown fresh green peas, perfect for curries.',
      tags: ['fresh', 'vegetables', 'seasonal']
    },
    {
      id: 10,
      name: 'Organic Honey',
      price: 850.00,
      unit: 'KG',
      farmer: 'Radhika Menon',
      location: 'Karnataka',
      rating: 4.9,
      sustainabilityScore: 96,
      available: 20,
      image: '/api/placeholder/400/400',
      description: 'Pure organic honey from wild flower nectar.',
      tags: ['organic', 'natural-sweeteners']
    },
    {
      id: 11,
      name: 'Fresh Coconuts',
      price: 20,
      unit: 'piece',
      farmer: 'Thomas George',
      location: 'Kerala',
      rating: 4.6,
      sustainabilityScore: 92,
      available: 100,
      image: '/api/placeholder/400/400',
      description: 'Fresh tender coconuts for natural refreshment.',
      tags: ['fresh', 'fruits', 'natural']
    },
    {
      id: 12,
      name: 'Organic Lentils',
      price: 90,
      unit: 'KG',
      farmer: 'Deepak Sharma',
      location: 'Madhya Pradesh',
      rating: 4.7,
      sustainabilityScore: 91,
      available: 80,
      image: '/api/placeholder/400/400',
      description: 'Organically grown mixed lentils for healthy meals.',
      tags: ['organic', 'pulses', 'staples']
    }
  ]);

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      if (existingItem.quantity >= product.available) {
        toast.error("Maximum available quantity reached");
        return;
      }
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    
    toast.success(`Added ${product.name} to cart`);
  };

  const updateQuantity = (productId, change) => {
    setCart(cart.map(item => {
      if (item.id === productId) {
        const newQuantity = item.quantity + change;
        if (newQuantity < 1 || newQuantity > item.available) return item;
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
    toast.success("Item removed from cart");
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.farmer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || product.tags.includes(selectedFilter);
    return matchesSearch && matchesFilter;
  });

  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  
  const uniqueTags = [...new Set(products.flatMap(product => product.tags))];

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-800 to-emerald-900">
      <Toaster position="top-right" />
      
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <Button 
            variant="ghost" 
            className="text-emerald-50 hover:text-white hover:bg-emerald-700/30"
            onClick={() => router.push('/consumer/dashboard')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>

          <Sheet>
            <SheetTrigger asChild>
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Cart ({cart.length})
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Shopping Cart</SheetTitle>
              </SheetHeader>
              <div className="mt-8">
                {cart.map(item => (
                  <div key={item.id} className="flex items-center justify-between py-4 border-b">
                    <div>
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-emerald-600">₹{item.price} / {item.unit}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, -1)}
                          disabled={item.quantity <= 1}
                        >-</Button>
                        <span>{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, 1)}
                          disabled={item.quantity >= item.available}
                        >+</Button>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => removeFromCart(item.id)}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
                {cart.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    Your cart is empty
                  </div>
                )}
                {cart.length > 0 && (
                  <div className="mt-8">
                    <div className="flex justify-between mb-4">
                      <span className="font-medium">Total:</span>
                      <span className="font-bold">₹{cartTotal.toFixed(2)}</span>
                    </div>
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                      Proceed to Checkout
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
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
          <Select value={selectedFilter} onValueChange={setSelectedFilter}>
            <SelectTrigger className="w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Products</SelectItem>
              <SelectItem value="organic">Organic</SelectItem>
              <SelectItem value="fresh">Fresh</SelectItem>
              <SelectItem value="vegetables">Vegetables</SelectItem>
              <SelectItem value="seeds">Seeds</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden animate-fadeIn hover:scale-105">
              <div className="aspect-square relative">
                <img
                  src={`/images/${product.name}.jpeg`}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 bg-emerald-500 text-white px-2 py-1 rounded-full text-sm flex items-center">
                  <Star className="h-4 w-4 mr-1 fill-current" />
                  {product.rating}
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold text-emerald-900">{product.name}</h3>
                  <div className="text-right">
                    <div className="text-lg font-bold text-emerald-700">₹{product.price}</div>
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
                    {product.sustainabilityScore}% Sustainable
                  </div>
                </div>
                <Button 
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                  onClick={() => addToCart(product)}
                >
                  Add to Cart
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12 bg-white/5 rounded-lg backdrop-blur-sm">
            <div className="text-emerald-100 text-lg">No products found</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopPage;