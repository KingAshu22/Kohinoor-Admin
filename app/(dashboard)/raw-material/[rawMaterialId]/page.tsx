"use client";

import Loader from "@/components/custom ui/Loader";
import RawMaterialForm from "@/components/raw-materials/RawMaterialForm";
import React, { useEffect, useState } from "react";

const RawMaterialDetails = ({
  params,
}: {
  params: { rawMaterialId: string };
}) => {
  const [loading, setLoading] = useState(true);
  const [rawMaterialDetails, setRawMaterialDetails] =
    useState<materialType | null>(null);

  const getRawMaterialDetails = async () => {
    try {
      const res = await fetch(`/api/raw-materials/${params.rawMaterialId}`, {
        method: "GET",
      });
      const data = await res.json();
      setRawMaterialDetails(data);
      setLoading(false);
    } catch (err) {
      console.log("[rawMaterialId_GET]", err);
    }
  };

  useEffect(() => {
    getRawMaterialDetails();
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <RawMaterialForm initialData={rawMaterialDetails} />
  );
};

export default RawMaterialDetails;
