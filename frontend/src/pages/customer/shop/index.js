import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ShoppingCart, ArrowLeft, Search, Star } from 'lucide-react';
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

const ShopPage = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Số lượng nhập cho từng sản phẩm
  const [quantityInput, setQuantityInput] = useState({});
  const [showQuantityInput, setShowQuantityInput] = useState(null);

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
        toast.error("Failed to load products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Lấy giỏ hàng thực từ API khi load trang
  const fetchCart = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user?._id) return;
      const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
      const res = await fetch(`${BASE_URL}/customers/cart/${user._id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
      });
      const data = await res.json();
      setCart((data.cart || []).map(item => ({
        product: item.product, // product là id
        quantity: item.quantity,
        name: item.name,
        price: item.price,
        available: item.availableQuantity ?? 0,
        unit: item.unit,
        image: item.image
      })));
    } catch (err) {
      setCart([]);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // Thêm vào giỏ hàng (gọi API)
  const addToCart = async (product, quantity = 1) => {
    if (!quantity || quantity < 1) {
      toast.error("Please enter a valid quantity");
      return;
    }
    const available = product.quantity ?? product.available ?? 0;
    if (quantity > available) {
      toast.error("Maximum available quantity reached");
      return;
    }

    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
      const res = await fetch(`${BASE_URL}/customers/cart/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: user?._id,
          product: product._id,
          quantity
        })
      });
      if (!res.ok) {
        const data = await res.json();
        toast.error(data.message || "Failed to add to cart");
        return;
      }
      toast.success(`Added ${product.name} x${quantity} to cart`);
      setShowQuantityInput(null);
      setQuantityInput(prev => ({ ...prev, [product._id]: '' }));
      await fetchCart(); // reload cart từ API
    } catch (err) {
      toast.error("Failed to add to cart");
    }
  };

  // Cập nhật số lượng trong cart (gọi lại API addToCart với change)
  const updateQuantity = async (productId, change) => {
    const item = cart.find(i => i.product === productId);
    if (!item) return;
    const available = item.available ?? item.availableQuantity ?? item.quantity ?? 0;
    const newQuantity = item.quantity + change;
    if (newQuantity < 1 || newQuantity > available) return;

    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
      const res = await fetch(`${BASE_URL}/customers/cart/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: user?._id,
          product: productId,
          quantity: change // chỉ cộng thêm change
        })
      });
      if (!res.ok) {
        const data = await res.json();
        toast.error(data.message || "Failed to update cart");
        return;
      }
      await fetchCart();
    } catch (err) {
      toast.error("Failed to update cart");
    }
  };

  // Xóa sản phẩm khỏi giỏ hàng (gọi API)
  const removeFromCart = async (productId) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
      const res = await fetch(`${BASE_URL}/customers/cart/remove`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: user?._id,
          product: productId
        })
      });
      if (!res.ok) {
        const data = await res.json();
        toast.error(data.message || "Failed to remove from cart");
        return;
      }
      toast.success("Item removed from cart");
      await fetchCart();
    } catch (err) {
      toast.error("Failed to remove from cart");
    }
  };

  // Thanh toán (gọi API checkout)
  const handleCheckout = async () => {
    if (cart.length === 0) return;
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
      const res = await fetch(`${BASE_URL}/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: user?._id,
          cart: cart.map(item => ({
            product: item.product,
            quantity: item.quantity
          }))
        })
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Order placed successfully!");
        setCart([]);
        await fetchCart();
        // Update wallet balance in localStorage
        if (typeof data.order?.totalPrice === "number" && typeof user.balance === "number") {
          const newUser = { ...user, balance: user.balance - data.order.totalPrice };
          localStorage.setItem("user", JSON.stringify(newUser));
        }
      } else {
        toast.error(data.message || "Checkout failed");
      }
    } catch (err) {
      toast.error("Checkout failed");
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.farmer?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-800 to-emerald-900">
      <Toaster position="top-right" />

      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            className="text-emerald-50 hover:text-white hover:bg-emerald-700/30"
            onClick={() => router.push('/customer/dashboard')}
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
                  <div key={item.product} className="flex items-center justify-between py-4 border-b">
                    <div>
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-emerald-600">₫{item.price} / {item.unit}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.product, -1)}
                          disabled={item.quantity <= 1}
                        >-</Button>
                        <span>{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.product, 1)}
                          disabled={item.quantity >= (item.available ?? 0)}
                        >+</Button>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => removeFromCart(item.product)}
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
                      <span className="font-bold">₫{cartTotal.toLocaleString('vi-VN')}</span>
                    </div>
                    <Button
                      className="w-full bg-emerald-600 hover:bg-emerald-700"
                      onClick={handleCheckout}
                      disabled={cart.length === 0}
                    >
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
                  {showQuantityInput === product._id ? (
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        min={1}
                        max={product.quantity ?? product.available ?? 0}
                        value={quantityInput[product._id] || 0}
                        onChange={e =>
                          setQuantityInput(prev => ({
                            ...prev,
                            [product._id]: e.target.value.replace(/^0+/, '')
                          }))
                        }
                        placeholder="Quantity"
                        className="w-24"
                      />
                      <Button
                        className="bg-emerald-600 hover:bg-emerald-700"
                        onClick={() =>
                          addToCart(product, Number(quantityInput[product._id]) || 1)
                        }
                      >
                        Confirm
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setShowQuantityInput(null);
                          setQuantityInput(prev => ({ ...prev, [product._id]: '' }));
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <Button
                      className="w-full bg-emerald-600 hover:bg-emerald-700"
                      onClick={() => setShowQuantityInput(product._id)}
                    >
                      Add to Cart
                    </Button>
                  )}
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