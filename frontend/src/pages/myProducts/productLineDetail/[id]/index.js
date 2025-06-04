import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BadgeCheck, Clock, XCircle, ArrowLeft, Image as ImageIcon, FileText } from "lucide-react";
import { toast, Toaster } from "sonner";

export default function ProductLineDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [line, setLine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!id) return;
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
        const res = await fetch(`${BASE_URL}/product-lines/detail/${id}`);
        const data = await res.json();
        if (res.ok && data.productLine) {
          setLine(data.productLine);
        } else {
          toast.error(data.message || "Cannot get product line detail");
        }
      } catch (err) {
        toast.error("Cannot get product line detail", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
    // Get user from localStorage
    const userData = localStorage.getItem("user");
    if (userData) setUser(JSON.parse(userData));
  }, [id]);

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

  // Approve handler
  const handleApprove = async () => {
    if (!window.confirm("Are you sure you want to approve this product line?")) return;
    try {
      const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
      const res = await fetch(`${BASE_URL}/admin/product-lines/approve/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        }
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Approved successfully!");
        setLine({ ...line, status: "approved" });
      } else {
        toast.error(data.message || "Approve failed!");
      }
    } catch (err) {
      toast.error("Approve failed!");
    }
  };

  // Reject handler
  const handleReject = async () => {
    if (!window.confirm("Are you sure you want to reject this product line?")) return;
    try {
      const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
      const res = await fetch(`${BASE_URL}/admin/product-lines/reject/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        }
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Rejected successfully!");
        setLine({ ...line, status: "rejected" });
      } else {
        toast.error(data.message || "Reject failed!");
      }
    } catch (err) {
      toast.error("Reject failed!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-800 to-emerald-900 py-10">
      <Toaster position="top-right" />
      <div className="max-w-2xl mx-auto px-4">
        <Button
          variant="ghost"
          className="mb-6 text-emerald-50 hover:text-white"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Card className="p-8 bg-white shadow-lg">
          {loading ? (
            <div className="text-center text-emerald-700 py-12">Loading...</div>
          ) : !line ? (
            <div className="text-center text-red-600 py-12">Product line not found</div>
          ) : (
            <div>
              <div className="flex items-center gap-6 mb-6">
                {line.image ? (
                  <img
                    src={line.image}
                    alt={line.name}
                    className="w-32 h-32 object-cover rounded shadow border"
                  />
                ) : (
                  <div className="w-32 h-32 flex items-center justify-center bg-gray-100 rounded border">
                    <ImageIcon className="text-gray-400" size={48} />
                  </div>
                )}
                <div>
                  <div className="text-2xl font-bold text-emerald-900">{line.name}</div>
                  <div className="text-gray-600 text-sm mb-1">Batch ID: {line.batchId}</div>
                  <div className="mb-1">{getStatus(line.status)}</div>
                  <div className="text-gray-700 text-sm">
                    Harvest Date: {line.harvestDate ? new Date(line.harvestDate).toLocaleDateString() : ""}
                  </div>
                </div>
              </div>
              {/* QR Code */}
              {line.qrCode && (
                <div className="mb-6 flex flex-col items-center">
                  <span className="font-semibold text-emerald-800 mb-2">Product Line QR Code:</span>
                  <img
                    src={line.qrCode}
                    alt="QR Code"
                    className="w-40 h-40 bg-white p-2 rounded shadow border"
                  />
                </div>
              )}
              <div className="mb-4">
                <span className="font-semibold text-emerald-800">Location:</span>{" "}
                <span className="text-gray-800">{line.location}</span>
              </div>
              <div className="mb-4">
                <span className="font-semibold text-emerald-800">Packaging Unit:</span>{" "}
                <span className="text-gray-800">{line.packagingUnit || "N/A"}</span>
              </div>
              <div className="mb-4">
                <span className="font-semibold text-emerald-800">Cultivation Process:</span>
                <ul className="list-disc ml-6 mt-1 text-gray-800">
                  {Array.isArray(line.cultivationProcess)
                    ? line.cultivationProcess.map((step, idx) => (
                        <li key={idx}>{step}</li>
                      ))
                    : (line.cultivationProcess || "").split("\n").map((step, idx) => (
                        <li key={idx}>{step}</li>
                      ))}
                </ul>
              </div>
              <div className="mb-4">
                <span className="font-semibold text-emerald-800">Certifications:</span>{" "}
                {line.certifications ? (
                  <a
                    href={line.certifications}
                    download="certifications"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-blue-600 underline"
                  >
                    <FileText className="h-4 w-4" /> View file
                  </a>
                ) : (
                  <span className="text-gray-800">N/A</span>
                )}
              </div>
              {/* Approve/Reject buttons for admin */}
              {user?.role === "admin" && line.status === "pending" && (
                <div className="mt-6 flex justify-end gap-4">
                  <Button
                    className="bg-green-600 hover:bg-green-700 text-white"
                    onClick={handleApprove}
                  >
                    Approve
                  </Button>
                  <Button
                    className="bg-red-600 hover:bg-red-700 text-white"
                    onClick={handleReject}
                  >
                    Reject
                  </Button>
                </div>
              )}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}