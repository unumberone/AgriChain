import React, { useState } from "react";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { toast, Toaster } from "sonner";
import axios from "axios";

const initialState = {
    name: "",
    location: "",
    cultivationProcess: "",
    packagingUnit: "",
    certifications: "", // base64
    harvestDate: "",
    batchId: "",
    image: "" // base64
};

function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

export default function RegisterProductLine() {
    const router = useRouter();
    const [form, setForm] = useState(initialState);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleCultivationChange = (e) => {
        setForm({ ...form, cultivationProcess: e.target.value });
    };

    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

    const handleCertChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > MAX_FILE_SIZE) {
                toast.error("File chứng nhận quá lớn (tối đa 5MB)!");
                return;
            }
            const base64 = await fileToBase64(file);
            setForm((prev) => ({ ...prev, certifications: base64 }));
        }
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > MAX_FILE_SIZE) {
                toast.error("Hình ảnh quá lớn (tối đa 5MB)!");
                return;
            }
            const base64 = await fileToBase64(file);
            setForm((prev) => ({ ...prev, image: base64 }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name || !form.location || !form.harvestDate || !form.batchId) {
            toast.error("Please fill in all required fields");
            return;
        }
        if (!form.certifications) {
            toast.error("Vui lòng tải lên file chứng nhận!");
            return;
        }
        if (!form.image) {
            toast.error("Vui lòng tải lên hình ảnh dòng sản phẩm!");
            return;
        }
        setLoading(true);
        try {
            const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
            const user = JSON.parse(localStorage.getItem("user"));
            const payload = {
                ...form,
                farmer: user._id
            };
            const res = await axios.post(
                `${BASE_URL}/product-lines/create`,
                payload,
                {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );
            if (res.status === 201 || res?.productLine) {
                toast.success("Product line registered successfully!");
                setTimeout(() => {
                    router.push("/myProducts/myProductLines");
                }, 1200);
            } else {
                toast.error(res?.message || "Register product line failed!");
            }
        } catch (err) {
            toast.error(err?.response?.data?.message || "Register product line failed!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-emerald-800 to-emerald-900 flex items-center justify-center">
            <Toaster position="top-right" />
            <Card className="w-full max-w-xl p-8 shadow-lg animate-fadeIn">
                <div className="flex items-center mb-6">
                    <Button
                        variant="ghost"
                        className="text-emerald-700 hover:text-emerald-900 mr-2"
                        onClick={() => router.push("/myProducts")}
                    >
                        <ArrowLeft className="h-4 w-4 mr-1" />
                        Back
                    </Button>
                    <h2 className="text-2xl font-bold text-emerald-900">Đăng ký dòng sản phẩm</h2>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="name">Tên dòng sản phẩm </Label>
                        <Input
                            id="name"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Tên dòng sản phẩm"
                            required
                        />
                    </div>
                    <div>
                        <Label htmlFor="batchId">Lô sản phẩm </Label>
                        <Input
                            id="batchId"
                            name="batchId"
                            value={form.batchId}
                            onChange={handleChange}
                            placeholder="Lô sản phẩm"
                            required
                        />
                    </div>
                    <div>
                        <Label htmlFor="location">Địa điểm </Label>
                        <Input
                            id="location"
                            name="location"
                            value={form.location}
                            onChange={handleChange}
                            placeholder="Địa điểm sản xuất"
                            required
                        />
                    </div>
                    <div>
                        <Label htmlFor="packagingUnit">Đơn vị đóng gói</Label>
                        <Input
                            id="packagingUnit"
                            name="packagingUnit"
                            value={form.packagingUnit}
                            onChange={handleChange}
                            placeholder="Đơn vị đóng gói"
                        />
                    </div>
                    <div>
                        <Label htmlFor="harvestDate">Ngày thu hoạch </Label>
                        <Input
                            id="harvestDate"
                            name="harvestDate"
                            type="date"
                            value={form.harvestDate}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <Label htmlFor="cultivationProcess">Quy trình canh tác</Label>
                        <textarea
                            id="cultivationProcess"
                            name="cultivationProcess"
                            value={form.cultivationProcess}
                            onChange={handleCultivationChange}
                            placeholder="Mỗi dòng là một bước quy trình canh tác"
                            rows={4}
                            className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-emerald-500"
                        />
                        <span className="text-xs text-gray-500">Nhập nhiều dòng, mỗi dòng là một bước</span>
                    </div>
                    <div>
                        <Label htmlFor="certifications">Chứng nhận </Label>
                        <Input
                            id="certifications"
                            name="certifications"
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={handleCertChange}
                            required
                        />
                        <span className="text-xs text-gray-500">Chỉ nhận file PDF hoặc ảnh</span>
                    </div>
                    <div>
                        <Label htmlFor="image">Hình ảnh dòng sản phẩm *</Label>
                        <Input
                            id="image"
                            name="image"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            required
                        />
                        <span className="text-xs text-gray-500">Chỉ nhận file ảnh</span>
                    </div>
                    <Button
                        type="submit"
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white mt-4"
                        disabled={loading}
                    >
                        {loading ? "Đang đăng ký..." : "Đăng ký dòng sản phẩm"}
                    </Button>
                </form>
            </Card>
        </div>
    );
}