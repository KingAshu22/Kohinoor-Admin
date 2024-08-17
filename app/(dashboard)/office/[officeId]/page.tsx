"use client";

import Loader from "@/components/custom ui/Loader";
import OfficeForm from "@/components/office/OfficeForm";
import React, { useEffect, useState } from "react";

const OfficeDetails = ({ params }: { params: { officeId: string } }) => {
  const [loading, setLoading] = useState(true);
  const [officeDetails, setOfficeDetails] = useState<materialType | null>(null);

  const getOfficeDetails = async () => {
    try {
      const res = await fetch(`/api/office/${params.officeId}`, {
        method: "GET",
      });
      const data = await res.json();
      setOfficeDetails(data);
      setLoading(false);
    } catch (err) {
      console.log("[officeId_GET]", err);
    }
  };

  useEffect(() => {
    getOfficeDetails();
  }, []);

  return loading ? <Loader /> : <OfficeForm initialData={officeDetails} />;
};

export default OfficeDetails;
