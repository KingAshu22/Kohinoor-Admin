"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Plus } from "lucide-react";

import Loader from "@/components/custom ui/Loader";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/custom ui/DataTable";
import { columns } from "@/components/raw-materials/MaterialColumn";

const RawMaterials = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [RawMaterial, setRawMaterial] = useState<materialType[]>([]);

  const getRawMaterials = async () => {
    try {
      const res = await fetch("/api/raw-materials", {
        method: "GET",
      });
      const data = await res.json();
      setRawMaterial(data);
      setLoading(false);
    } catch (err) {
      console.log("[rawMaterial_GET]", err);
    }
  };

  useEffect(() => {
    getRawMaterials();
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <div className="px-10 py-5">
      <div className="flex items-center justify-between">
        <p className="text-heading2-bold">Raw Material</p>
        <Button
          className="bg-blue-1 text-white"
          onClick={() => router.push("/raw-material/new")}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Raw Material Entry
        </Button>
      </div>
      <Separator className="bg-grey-1 my-4" />
      <DataTable columns={columns} data={RawMaterial} searchKey="title" />
    </div>
  );
};

export default RawMaterials;
