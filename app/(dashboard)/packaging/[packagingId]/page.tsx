"use client";

import Loader from "@/components/custom ui/Loader";
import PackagingForm from "@/components/packaging/PackagingForm";
import React, { useEffect, useState } from "react";

const PackagingDetails = ({ params }: { params: { packagingId: string } }) => {
  const [loading, setLoading] = useState(true);
  const [PackagingDetails, setPackagingDetails] = useState<materialType | null>(
    null
  );

  const getPackagingDetails = async () => {
    try {
      const res = await fetch(`/api/packagings/${params.packagingId}`, {
        method: "GET",
      });
      const data = await res.json();
      setPackagingDetails(data);
      setLoading(false);
    } catch (err) {
      console.log("[packagingId_GET]", err);
    }
  };

  useEffect(() => {
    getPackagingDetails();
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <PackagingForm initialData={PackagingDetails} />
  );
};

export default PackagingDetails;
