import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Toaster, toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, PackageCheck, ArrowLeft } from "lucide-react";

const HistoryOrderPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // Lấy lịch sử đơn hàng từ API
    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            try {
                const user = JSON.parse(localStorage.getItem("user"));
                if (!user?._id) return;
                const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
                const res = await fetch(`${BASE_URL}/orders/${user._id}`);
                const data = await res.json();
                setOrders(data || []);
            } catch (err) {
                toast.error("Failed to load order history");
                setOrders([]);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-b from-emerald-800 to-emerald-900">
            <Toaster position="top-right" />

            <div className="max-w-4xl mx-auto p-6">
                <Button
                    variant="ghost"
                    className="text-emerald-50 hover:text-white hover:bg-emerald-700/30"
                    onClick={() => router.push('/customer/dashboard')}
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Dashboard
                </Button>
                <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-2">
                        <Clock className="text-emerald-300" size={28} />
                        <h1 className="text-3xl font-bold text-white">Order History</h1>
                    </div>
                </div>
                {loading ? (
                    <div className="text-center text-white py-24 text-xl animate-pulse">
                        Loading orders...
                    </div>
                ) : orders.length === 0 ? (
                    <div className="text-center py-12 bg-white/5 rounded-lg backdrop-blur-sm">
                        <div className="text-emerald-100 text-lg">No orders found</div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <Card key={order._id} className="p-6 bg-white/90">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <PackageCheck className="text-emerald-600" />
                                        <span className="font-semibold text-emerald-900">
                                            Order #{order._id}
                                        </span>
                                    </div>
                                    <span className="text-sm text-gray-500">
                                        {new Date(order.createdAt).toLocaleString()}
                                    </span>
                                </div>
                                <div className="mb-2">
                                    {order.products.map((item, idx) => (
                                        <div key={idx} className="flex justify-between items-center py-1 border-b last:border-b-0">
                                            <div>
                                                <span className="font-medium">{item.name || item.product?.name}</span>
                                                <span className="ml-2 text-gray-500 text-xs">
                                                    x{item.quantity} {item.product?.unit}
                                                </span>
                                            </div>
                                            <span className="text-emerald-700 font-semibold">
                                                ₫{Number(item.price).toLocaleString("vi-VN")}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex justify-between items-center mt-4">
                                    <span className="font-bold text-emerald-800">
                                        Total: ₫{Number(order.totalPrice).toLocaleString("vi-VN")}
                                    </span>
                                    <span className="text-xs px-3 py-1 rounded-full bg-emerald-100 text-emerald-700">
                                        {order.status === "success" ? "Completed" : order.status}
                                    </span>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default HistoryOrderPage;