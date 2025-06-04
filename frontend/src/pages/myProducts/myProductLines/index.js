import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BadgeCheck, Clock, XCircle, ArrowRight, ArrowLeft, Image as ImageIcon, Plus } from "lucide-react";
import { toast, Toaster } from "sonner";

export default function MyProductLines() {
    const router = useRouter();
    const [lines, setLines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem("user"));
        setUser(userData);
        const fetchLines = async () => {
            setLoading(true);
            try {
                const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
                const res = await fetch(`${BASE_URL}/product-lines/list`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ farmer: userData._id, role: userData.role })
                });
                const data = await res.json();
                if (res.ok) {
                    setLines(data.productLines || []);
                } else {
                    toast.error(data.message || "Cannot fetch product lines");
                }
            } catch (err) {
                toast.error("Cannot fetch product lines");
            } finally {
                setLoading(false);
            }
        };
        fetchLines();
    }, []);

    const getStatus = (status) => {
        switch (status) {
            case "approved":
                return (
                    <span className="flex items-center gap-1 text-green-600 font-medium">
                        <BadgeCheck className="h-4 w-4" /> Approved
                    </span>
                );
            case "pending":
                return (
                    <span className="flex items-center gap-1 text-yellow-600 font-medium">
                        <Clock className="h-4 w-4" /> Pending
                    </span>
                );
            case "rejected":
                return (
                    <span className="flex items-center gap-1 text-red-600 font-medium">
                        <XCircle className="h-4 w-4" /> Rejected
                    </span>
                );
            default:
                return status;
        }
    };

    // Filter and search logic (on UI)
    const filteredLines = lines.filter(line => {
        // Filter by status
        if (statusFilter !== "all" && line.status !== statusFilter) return false;
        // Search by name or batchId (case-insensitive)
        if (
            search &&
            !(
                line.name?.toLowerCase().includes(search.toLowerCase()) ||
                line.batchId?.toLowerCase().includes(search.toLowerCase())
            )
        ) {
            return false;
        }
        return true;
    });

    return (
        <div className="min-h-screen bg-gradient-to-b from-emerald-800 to-emerald-900 py-10">
            <Toaster position="top-right" />
            <div className="max-w-4xl mx-auto px-4">
                <div className="mb-6 flex gap-2 items-center">
                    <Button
                        variant="ghost"
                        className="text-emerald-50 hover:text-white"
                        onClick={() => router.back()}
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Dashboard
                    </Button>
    
                </div>
                <h1 className="text-3xl font-bold text-white mb-8">Product Lines</h1>
                {/* Filter and search */}
                <div className="flex flex-col md:flex-row md:items-center gap-3 mb-6">
                    <input
                        type="text"
                        placeholder="Search by name or batch ID..."
                        className="px-3 py-2 rounded border outline-none w-full md:w-1/2"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                    <select
                        className="px-3 py-2 rounded border outline-none w-full md:w-48"
                        value={statusFilter}
                        onChange={e => setStatusFilter(e.target.value)}
                    >
                        <option value="all">All Status</option>
                        <option value="approved">Approved</option>
                        <option value="pending">Pending</option>
                        <option value="rejected">Rejected</option>
                    </select>
                    {/* Only show add button for farmer */}
                    {user?.role === "farmer" && (
                        <Button
                            className="bg-emerald-600 hover:bg-emerald-700 text-white ml-2 flex items-center gap-2"
                            onClick={() => router.push("/myProducts/registerProductLine")}
                        >
                            <Plus className="h-4 w-4" /> Add Product Line
                        </Button>
                    )}
                </div>
                {loading ? (
                    <div className="text-white text-center py-12">Loading...</div>
                ) : filteredLines.length === 0 ? (
                    <div className="text-white text-center py-12">No product lines found.</div>
                ) : (
                    <div className="space-y-4">
                        {filteredLines.map((line) => (
                            <Card
                                key={line._id}
                                className="flex items-center justify-between p-6 hover:shadow-lg transition cursor-pointer bg-white"
                                onClick={() => router.push(`/myProducts/myProductLines/${line._id}`)}
                            >
                                <div className="flex items-center gap-4">
                                    {/* Show product line image if available */}
                                    {line.image ? (
                                        <img
                                            src={line.image}
                                            alt={line.name}
                                            className="w-16 h-16 object-cover rounded shadow border"
                                        />
                                    ) : (
                                        <div className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded border">
                                            <ImageIcon className="text-gray-400" />
                                        </div>
                                    )}
                                    <div>
                                        <div className="text-xl font-semibold text-emerald-900">{line.name}</div>
                                        <div className="text-gray-600 text-sm">Batch ID: {line.batchId}</div>
                                        <div className="mt-1">{getStatus(line.status)}</div>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    className="text-emerald-700 hover:text-emerald-900"
                                    onClick={e => {
                                        e.stopPropagation();
                                        router.push(`/myProducts/productLineDetail/${line._id}`);
                                    }}
                                >
                                    View Details <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}