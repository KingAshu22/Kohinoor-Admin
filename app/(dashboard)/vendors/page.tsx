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
  const [filteredVendors, setFilteredVendors] = useState<VendorType[]>([]);
  const [selectedType, setSelectedType] = useState("Raw Material");

  const vendorTypes = [
    "Raw Material",
    "Polishing",
    "Work From Home",
    "Work From Office",
  ];

  const getVendors = async () => {
    try {
      const res = await fetch("/api/vendors", {
        method: "GET",
      });
      const data = await res.json();
      setVendors(data);
      setLoading(false);
      filterVendors("Raw Material", data); // Set initial filter to 'Raw Material'
    } catch (err) {
      console.log("[vendors_GET]", err);
    }
  };

  const filterVendors = (type: string, vendorsData?: VendorType[]) => {
    const data = vendorsData || vendors;
    const filtered = data.filter((vendor) => vendor.type === type);
    setFilteredVendors(filtered);
  };

  useEffect(() => {
    getVendors();
  }, []);

  useEffect(() => {
    filterVendors(selectedType);
  }, [selectedType]);

  return loading ? (
    <Loader />
  ) : (
    <div className="px-10 py-5">
      <div className="flex items-center justify-between">
        <p className="text-heading2-bold">Users</p>
        <Button
          className="bg-blue-1 text-white"
          onClick={() => router.push("/vendors/new")}
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Users
        </Button>
      </div>
      <div className="my-4">
        {vendorTypes.map((type) => (
          <Button
            key={type}
            className={`mr-2 text-white ${
              selectedType === type ? "bg-blue-1" : "bg-grey-1"
            }`}
            onClick={() => setSelectedType(type)}
          >
            {type}
          </Button>
        ))}
      </div>
      <Separator className="bg-grey-1 my-4" />
      <DataTable columns={columns} data={filteredVendors} searchKey="title" />
    </div>
  );
};

export default Vendors;
