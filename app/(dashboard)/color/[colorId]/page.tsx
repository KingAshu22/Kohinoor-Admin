"use client";

import Loader from "@/components/custom ui/Loader";
import ColorForm from "@/components/colors/ColorForm";
import React, { useEffect, useState } from "react";

const ColorDetails = ({ params }: { params: { colorId: string } }) => {
  const [loading, setLoading] = useState(true);
  const [colorDetails, setColorDetails] = useState<materialType | null>(null);

  const getColorDetails = async () => {
    try {
      const res = await fetch(`/api/color/${params.colorId}`, {
        method: "GET",
      });
      const data = await res.json();
      setColorDetails(data);
      setLoading(false);
    } catch (err) {
      console.log("[colorId_GET]", err);
    }
  };

  useEffect(() => {
    getColorDetails();
  }, []);

  return loading ? <Loader /> : <ColorForm initialData={colorDetails} />;
};

export default ColorDetails;
