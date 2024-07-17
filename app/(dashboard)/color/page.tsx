"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Plus } from "lucide-react";

import Loader from "@/components/custom ui/Loader";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/custom ui/DataTable";
import { columns } from "@/components/colors/ColorColumn";

const ColorMaterials = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [colorMaterial, setColorMaterial] = useState<materialType[]>([]);

  const getColorMaterials = async () => {
    try {
      const res = await fetch("/api/color", {
        method: "GET",
      });
      const data = await res.json();
      setColorMaterial(data);
      setLoading(false);
    } catch (err) {
      console.log("[color_GET]", err);
    }
  };

  useEffect(() => {
    getColorMaterials();
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <div className="px-10 py-5">
      <div className="flex items-center justify-between">
        <p className="text-heading2-bold">Color</p>
        <Button
          className="bg-blue-1 text-white"
          onClick={() => router.push("/color/new")}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Color Entry
        </Button>
      </div>
      <Separator className="bg-grey-1 my-4" />
      <DataTable columns={columns} data={colorMaterial} searchKey="title" />
    </div>
  );
};

export default ColorMaterials;
