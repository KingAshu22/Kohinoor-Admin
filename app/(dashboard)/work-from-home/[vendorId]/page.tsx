"use client";

import Loader from "@/components/custom ui/Loader";
import VendorForm from "@/components/vendors/VendorForm";
import React, { useEffect, useState } from "react";

const VendorDetails = ({ params }: { params: { vendorId: string } }) => {
  const [loading, setLoading] = useState(true);
  const [vendorDetails, setVendorDetails] = useState<VendorType | null>(null);

  const getVendorDetails = async () => {
    try {
      const res = await fetch(`/api/vendors/${params.vendorId}`, {
        method: "GET",
      });
      const data = await res.json();
      setVendorDetails(data);
      setLoading(false);
    } catch (err) {
      console.log("[vendorId_GET]", err);
    }
  };

  useEffect(() => {
    getVendorDetails();
  }, []);

  return loading ? <Loader /> : <VendorForm initialData={vendorDetails} />;
};

export default VendorDetails;
