import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Plus, Trash2, MinusCircle, PlusCircle, ArrowLeft } from 'lucide-react';
import { toast, Toaster } from 'sonner';

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const UNIT_OPTIONS = [
  { value: 'kg', label: 'kg' },
  { value: 'g', label: 'g' },
  { value: 'ton', label: 'ton' },
  { value: 'piece', label: 'piece' },
  { value: 'bag', label: 'bag' },
  { value: 'box', label: 'box' },
];

const MyProducts = () => {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [productLines, setProductLines] = useState([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [newProduct, setNewProduct] = useState({
    name: '',
    quantity: '',
    unit: 'kg',
    price: '',
    productLineId: ''
  });

  const LOW_STOCK_THRESHOLD = 5;

  // Format quantity and VND currency
  const formatQuantity = (value, unit) =>
    `${Number(value).toLocaleString('en-US', { maximumFractionDigits: 2 })} ${unit}`;
  const formatCurrency = (value) =>
    Number(value).toLocaleString('en-US', { style: 'currency', currency: 'VND' });

  // Fetch real products and approved product lines
  useEffect(() => {
    const fetchData = async () => {
      setLoadingData(true);
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

        // Get products
        const resProducts = await fetch(`${BASE_URL}/products/list`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ farmer: user._id })
        });
        const dataProducts = await resProducts.json();
        if (resProducts.ok) {
          setProducts(dataProducts.products || []);
        } else {
          toast.error(dataProducts.message || "Failed to fetch products");
        }

        // Get approved product lines
        const resLines = await fetch(`${BASE_URL}/product-lines/list`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ farmer: user._id })
        });
        const dataLines = await resLines.json();
        if (resLines.ok) {
          setProductLines((dataLines.productLines || []).filter(l => l.status === "approved"));
        } else {
          toast.error(dataLines.message || "Failed to fetch product lines");
        }
      } catch (err) {
        toast.error("Error loading data");
      } finally {
        setLoadingData(false);
      }
    };
    fetchData();
  }, []);

  const handleQuantityChange = (id, change) => {
    setProducts(products.map(product => {
      if (product._id === id) {
        const newQuantity = Math.max(0, Number(product.quantity) + change);
        return {
          ...product,
          quantity: newQuantity,
          lowStock: newQuantity <= LOW_STOCK_THRESHOLD
        };
      }
      return product;
    }));
  };

  const handleDelete = async (id) => {
    try {
      const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
      const res = await fetch(`${BASE_URL}/products/delete/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok) {
        setProducts(products.filter(product => product._id !== id));
        toast.success(data.message || "Product deleted");
      } else {
        toast.error(data.message || "Delete failed");
      }
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  // Save product directly, no price suggestion
  const handleAddProduct = async () => {
    if (!newProduct.productLineId) {
      toast.error("Please select a product line");
      return;
    }
    if (!newProduct.name || !newProduct.quantity || !newProduct.price) {
      toast.error("Please fill all required fields");
      return;
    }

    const quantity = Number(newProduct.quantity);
    const finalPrice = Number(newProduct.price);

    if (isNaN(quantity) || quantity <= 0) {
      toast.error("Please enter a valid quantity");
      return;
    }
    if (isNaN(finalPrice) || finalPrice <= 0) {
      toast.error("Please enter a valid price");
      return;
    }

    try {
      setIsLoading(true);
      const user = JSON.parse(localStorage.getItem("user"));
      const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
      const res = await fetch(`${BASE_URL}/products/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newProduct.name.trim(),
          quantity,
          unit: newProduct.unit,
          price: finalPrice,
          farmer: user._id,
          productLine: newProduct.productLineId
        })
      });
      const data = await res.json();
      if (res.ok) {
        setProducts([...products, data.product]);
        toast.success(`${newProduct.name} added`);
      } else {
        toast.error(data.message || "Failed to add product");
      }
    } catch (err) {
      toast.error("Failed to add product");
    } finally {
      setIsLoading(false);
    }

    setNewProduct({
      name: '',
      quantity: '',
      unit: 'kg',
      price: '',
      productLineId: ''
    });

    setIsAddDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-800 to-emerald-900">
      <Toaster position="top-right" />
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center mb-8">
          <Button
            variant="ghost"
            className="text-emerald-50 hover:text-white hover:bg-emerald-700/30 transition-colors"
            onClick={() => router.push('/dashboard')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>

        <div className="flex justify-between items-center mb-8">
          <div className="animate-slideRight">
            <h1 className="text-4xl font-bold text-white mb-2">My Products</h1>
            <p className="text-emerald-100 text-lg">Manage your product inventory</p>
          </div>
          <div className="flex gap-2">
            <Button
              className="bg-emerald-500 hover:bg-emerald-600 text-white border-none shadow-lg hover:shadow-xl transition-all animate-slideLeft"
              onClick={() => router.push('/myProducts/registerProductLine')}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Product Line
            </Button>
            <Button
              onClick={() => setIsAddDialogOpen(true)}
              className="bg-emerald-500 hover:bg-emerald-600 text-white border-none shadow-lg hover:shadow-xl transition-all animate-slideLeft"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </div>
        </div>

        {loadingData ? (
          <div className="text-center py-24 text-white text-xl animate-pulse">Loading...</div>
        ) : (
          <div className="grid gap-4">
            {products.map((product) => (
              <Card key={product._id} className="animate-fadeIn hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center justify-between p-6">
                  <div className="flex items-center space-x-6">
                    <div className="relative w-24 h-24 bg-emerald-50 rounded-xl overflow-hidden">
                      <img
                        src={product.image || '/api/placeholder/400/400'}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                      />
                      {product.lowStock && (
                        <div className="absolute bottom-0 left-0 right-0 bg-red-500 text-white text-xs py-1 text-center">
                          Low Stock
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-emerald-900 mb-1">{product.name}</h3>
                      <p className="text-emerald-700 font-medium text-lg">
                        {formatCurrency(product.price)} / {product.unit}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-3">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleQuantityChange(product._id, -1)}
                        className="hover:bg-emerald-50"
                      >
                        <MinusCircle className="h-5 w-5 text-emerald-700" />
                      </Button>
                      <span className="w-24 text-center text-emerald-800 font-medium text-lg">
                        {formatQuantity(product.quantity, product.unit)}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleQuantityChange(product._id, 1)}
                        className="hover:bg-emerald-50"
                      >
                        <PlusCircle className="h-5 w-5 text-emerald-700" />
                      </Button>
                    </div>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDelete(product._id)}
                      className="hover:bg-red-600 transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}

            {products.length === 0 && (
              <div className="text-center py-12 bg-white/5 rounded-lg backdrop-blur-sm animate-fadeIn">
                <div className="text-emerald-100 text-lg mb-4">No products in your inventory</div>
                <Button
                  onClick={() => setIsAddDialogOpen(true)}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add your first product
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Add Product Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add new product</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="productLine">Product Line</Label>
                <select
                  id="productLine"
                  value={newProduct.productLineId}
                  onChange={e => {
                    const selectedLine = productLines.find(l => l._id === e.target.value);
                    setNewProduct({
                      ...newProduct,
                      productLineId: e.target.value,
                      name: selectedLine ? selectedLine.name : ''
                    });
                  }}
                  className="px-3 py-2 rounded border outline-none w-full"
                >
                  <option value="">Select product line...</option>
                  {productLines.map(line => (
                    <option key={line._id} value={line._id}>
                      {line.name} (Batch: {line.batchId})
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="0"
                  step="0.1"
                  value={newProduct.quantity}
                  onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })}
                  placeholder="Enter quantity"
                  className="focus:ring-emerald-500"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="unit">Unit</Label>
                <select
                  id="unit"
                  value={newProduct.unit}
                  onChange={e => setNewProduct({ ...newProduct, unit: e.target.value })}
                  className="px-3 py-2 rounded border outline-none w-full"
                >
                  {UNIT_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="price">Price (VND)</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                  placeholder="Enter price"
                  className="focus:ring-emerald-500"
                />
              </div>
            </div>
            <Button
              onClick={handleAddProduct}
              className="w-full bg-emerald-600 hover:bg-emerald-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                  Saving...
                </div>
              ) : (
                "Save Product"
              )}
            </Button>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default MyProducts;