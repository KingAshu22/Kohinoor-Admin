"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Plus } from "lucide-react";

import Loader from "@/components/custom ui/Loader";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/custom ui/DataTable";
import { columns } from "@/components/vendors/VendorColumns";

const Vendors = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [vendors, setVendors] = useState<VendorType[]>([]);

  const getVendors = async () => {
    try {
      const res = await fetch("/api/vendors", {
        method: "GET",
      });
      const data = await res.json();
      // Fixed filtering logic
      const filteredVendors = data.filter(
        (vendor: VendorType) =>
          vendor.type === "Raw Material" || vendor.type === "Polishing"
      );
      setVendors(filteredVendors);
      setLoading(false);
    } catch (err) {
      console.log("[vendors_GET]", err);
    }
  };

  useEffect(() => {
    getVendors();
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <div className="px-10 py-5">
      <div className="flex items-center justify-between">
        <p className="text-heading2-bold">Vendors</p>
        <Button
          className="bg-blue-1 text-white"
          onClick={() => router.push("/vendors/new")}
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Vendor
        </Button>
      </div>
      <Separator className="bg-grey-1 my-4" />
      <DataTable columns={columns} data={vendors} searchKey="title" />
    </div>
  );
};

export default Vendors;
