"use client";

import Loader from "@/components/custom ui/Loader";
import BoxForm from "@/components/box/BoxForm";
import React, { useEffect, useState } from "react";

const BoxDetails = ({ params }: { params: { boxId: string } }) => {
  const [loading, setLoading] = useState(true);
  const [BoxDetails, setBoxDetails] = useState<materialType | null>(null);

  const getBoxDetails = async () => {
    try {
      const res = await fetch(`/api/box/${params.boxId}`, {
        method: "GET",
      });
      const data = await res.json();
      setBoxDetails(data);
      setLoading(false);
    } catch (err) {
      console.log("[boxId_GET]", err);
    }
  };

  useEffect(() => {
    getBoxDetails();
  }, []);

  return loading ? <Loader /> : <BoxForm initialData={BoxDetails} />;
};

export default BoxDetails;
