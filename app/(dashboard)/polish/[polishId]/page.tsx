"use client";

import Loader from "@/components/custom ui/Loader";
import PolishForm from "@/components/polish/PolishForm";
import React, { useEffect, useState } from "react";

const PolishDetails = ({ params }: { params: { polishId: string } }) => {
  const [loading, setLoading] = useState(true);
  const [polishDetails, setPolishDetails] = useState<materialType | null>(null);

  const getPolishDetails = async () => {
    try {
      const res = await fetch(`/api/polish/${params.polishId}`, {
        method: "GET",
      });
      const data = await res.json();
      setPolishDetails(data);
      setLoading(false);
    } catch (err) {
      console.log("[polishId_GET]", err);
    }
  };

  useEffect(() => {
    getPolishDetails();
  }, []);

  return loading ? <Loader /> : <PolishForm initialData={polishDetails} />;
};

export default PolishDetails;
