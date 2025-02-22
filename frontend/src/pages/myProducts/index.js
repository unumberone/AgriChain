import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Plus, Trash2, MinusCircle, PlusCircle, ArrowLeft, AlertCircle } from 'lucide-react';
import { toast, Toaster } from 'sonner';

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

const MyProducts = () => {
    const router = useRouter();
    const [products, setProducts] = useState([
      {
        id: 1,
        name: 'Carrots',
        quantity: 20,
        unit: 'KG',
        price: 565,
        image: '/images/carrots.jpeg'
      },
      {
        id: 2,
        name: 'Tomato',
        quantity: 3,
        unit: 'KG',
        price: 74.25,
        image: '/images/tomato.webp',
        lowStock: true
      },
      {
        id: 3,
        name: 'Sunflower Seeds',
        quantity: 7,
        unit: 'KG',
        price: 680.72,
        image: '/images/sunflower-seeds.jpeg'
      }
    ]);
  
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isPriceDialogOpen, setIsPriceDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [newProduct, setNewProduct] = useState({
      name: '',
      quantity: '',
      unit: 'KG',
      price: '',
      fairPrice: null,
      priceNote: '',
      farmerExpenses: '',
      sustainabilityScore: 50
    });
  
    const LOW_STOCK_THRESHOLD = 5;
  
    const getFairPrice = async () => {
      try {
        setIsLoading(true);
        
        // Validate input values
        if (!newProduct.name || !newProduct.farmerExpenses || !newProduct.sustainabilityScore) {
          throw new Error('Missing required fields');
        }
  
        // Ensure numeric values are properly formatted
        const expenses = Number(newProduct.farmerExpenses);
        const sustainability = Number(newProduct.sustainabilityScore);
  
        if (isNaN(expenses) || isNaN(sustainability)) {
          throw new Error('Invalid numeric values');
        }
  
        const response = await fetch(`http://localhost:5000/api/data/finalPrice?commodity=${newProduct.name}&&farmerExpenses=${expenses}&&sustainabilityScore=${sustainability}`);
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const data = await response.json();
  
        if (!data || !data.success) {
          throw new Error(data?.message || 'Failed to get fair price');
        }
  
        setNewProduct(prev => ({
          ...prev,
          fairPrice: data.finalPrice,
          priceNote: data.priceNote
        }));
        
        setIsPriceDialogOpen(true);
      } catch (error) {
        console.error('Fair price calculation error:', error);
        toast.error(error.message || "Failed to calculate fair price. Please try again.");
        setIsPriceDialogOpen(false);
      } finally {
        setIsLoading(false);
      }
    };
  
    // Rest of the component remains exactly the same
    const handleQuantityChange = (id, change) => {
      setProducts(products.map(product => {
        if (product.id === id) {
          const newQuantity = Math.max(0, product.quantity + change);
          return {
            ...product,
            quantity: newQuantity,
            lowStock: newQuantity <= LOW_STOCK_THRESHOLD
          };
        }
        return product;
      }));
    };
  
    const handleDelete = (id) => {
      const productToDelete = products.find(p => p.id === id);
      if (!productToDelete) return;
  
      setProducts(products.filter(product => product.id !== id));
      toast.success(`${productToDelete.name} removed from inventory`);
    };
  
    const handleAddProduct = (useFairPrice = false) => {
        if (newProduct.name && newProduct.quantity) {
            const finalPrice = useFairPrice ? newProduct.fairPrice : Number(newProduct.price);
            
            if (!finalPrice) {
              toast.error("Please enter a valid price");
              return;
            }
    
            const quantity = Number(newProduct.quantity);
            
            // Check if product already exists (case-insensitive comparison)
            const existingProductIndex = products.findIndex(
              p => p.name.toLowerCase() === newProduct.name.trim().toLowerCase()
            );
    
            if (existingProductIndex !== -1) {
              // Update existing product quantity
              setProducts(products.map((product, index) => {
                if (index === existingProductIndex) {
                  const updatedQuantity = product.quantity + quantity;
                  return {
                    ...product,
                    quantity: updatedQuantity,
                    lowStock: updatedQuantity <= LOW_STOCK_THRESHOLD
                  };
                }
                return product;
              }));
    
              toast.success(`Updated quantity for ${newProduct.name}`);
            } else {
              // Add new product
              setProducts([...products, {
                id: Date.now(),
                ...newProduct,
                name: newProduct.name.trim(), // Ensure consistent naming
                price: finalPrice,
                quantity,
                lowStock: quantity <= LOW_STOCK_THRESHOLD,
                image: '/api/placeholder/400/400'
              }]);
    
              toast.success(`${newProduct.name} added successfully`);
            }
    
            // Reset form
            setNewProduct({
              name: '',
              quantity: '',
              unit: 'KG',
              price: '',
              fairPrice: null,
              priceNote: '',
              farmerExpenses: '',
              sustainabilityScore: 50
            });
            
            setIsAddDialogOpen(false);
            setIsPriceDialogOpen(false);
          }
        };  
  
    const validateProductData = () => {
      if (!newProduct.name.trim()) {
        toast.error("Please enter a product name");
        return false;
      }
      if (!newProduct.quantity || Number(newProduct.quantity) <= 0) {
        toast.error("Please enter a valid quantity");
        return false;
      }
      if (!newProduct.farmerExpenses || Number(newProduct.farmerExpenses) <= 0) {
        toast.error("Please enter your expenses");
        return false;
      }
      return true;
    };
  
    const handlePriceCalculation = () => {
      if (validateProductData()) {
        getFairPrice();
      }
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
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <Button 
              onClick={() => setIsAddDialogOpen(true)}
              className="bg-emerald-500 hover:bg-emerald-600 text-white border-none shadow-lg hover:shadow-xl transition-all animate-slideLeft"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Product Name</Label>
                  <Input
                    id="name"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                    placeholder="Enter product name"
                    className="focus:ring-emerald-500"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="quantity">Quantity (KG)</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="0"
                    step="0.1"
                    value={newProduct.quantity}
                    onChange={(e) => setNewProduct({...newProduct, quantity: e.target.value})}
                    placeholder="Enter quantity"
                    className="focus:ring-emerald-500"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="expenses">Your Expenses (₹)</Label>
                  <Input
                    id="expenses"
                    type="number"
                    min="0"
                    step="0.01"
                    value={newProduct.farmerExpenses}
                    onChange={(e) => setNewProduct({...newProduct, farmerExpenses: e.target.value})}
                    placeholder="Enter your total expenses"
                    className="focus:ring-emerald-500"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="sustainability">
                    Sustainability Score: {newProduct.sustainabilityScore}
                  </Label>
                  <Slider
                    id="sustainability"
                    min={0}
                    max={100}
                    step={1}
                    value={[newProduct.sustainabilityScore]}
                    onValueChange={([value]) => setNewProduct({...newProduct, sustainabilityScore: value})}
                    className="py-4"
                  />
                  <p className="text-sm text-muted-foreground">
                    Rate your sustainable farming practices (0-100)
                  </p>
                </div>
              </div>
              <Button 
                onClick={handlePriceCalculation}
                className="w-full bg-emerald-600 hover:bg-emerald-700"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                    Calculating...
                  </div>
                ) : (
                  "Get Fair Price Suggestion"
                )}
              </Button>
            </DialogContent>
          </Dialog>

          <Dialog open={isPriceDialogOpen} onOpenChange={setIsPriceDialogOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Suggested Fair Price</DialogTitle>
              </DialogHeader>
              
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-4">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-emerald-600 mt-0.5 mr-2" />
                  <div>
                    <h4 className="font-semibold text-emerald-800">Fair Price Suggestion</h4>
                    <p className="text-emerald-700 text-lg font-semibold">
                      ₹{newProduct.fairPrice?.toFixed(2)} per {newProduct.unit}
                    </p>
                    {newProduct.priceNote && (
                      <p className="mt-2 text-sm text-emerald-600">
                        {newProduct.priceNote}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="customPrice">Custom Price (Optional)</Label>
                  <Input
                    id="customPrice"
                    type="number"
                    min="0"
                    step="0.01"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                    placeholder="Enter your price"
                    className="focus:ring-emerald-500"
                  />
                </div>
              </div>

              <DialogFooter className="flex gap-2 sm:gap-0">
                <Button 
                  onClick={() => handleAddProduct(true)}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                >
                  Accept Fair Price
                </Button>
                <Button 
                  onClick={() => handleAddProduct(false)}
                  variant="outline"
                  className="flex-1 border-emerald-600 text-emerald-700 hover:bg-emerald-50"
                  disabled={!newProduct.price}
                >
                  Use Custom Price
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4">
          {products.map((product) => (
            <Card key={product.id} className="animate-fadeIn hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center justify-between p-6">
                <div className="flex items-center space-x-6">
                  <div className="relative w-24 h-24 bg-emerald-50 rounded-xl overflow-hidden">
                    <img
                      src={product.image}
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
                    <p className="text-emerald-700 font-medium text-lg">₹{product.price.toFixed(2)} / {product.unit}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleQuantityChange(product.id, -1)}
                      className="hover:bg-emerald-50"
                    >
                      <MinusCircle className="h-5 w-5 text-emerald-700" />
                    </Button>
                    <span className="w-24 text-center text-emerald-800 font-medium text-lg">
                      {product.quantity} {product.unit}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleQuantityChange(product.id, 1)}
                      className="hover:bg-emerald-50"
                    >
                      <PlusCircle className="h-5 w-5 text-emerald-700" />
                    </Button>
                  </div>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDelete(product.id)}
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
              Add Your First Product
            </Button>
          </div>
        )}
      </div>
    </div>
  </div>
);
};

export default MyProducts;