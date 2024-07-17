"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Plus } from "lucide-react";

import Loader from "@/components/custom ui/Loader";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/custom ui/DataTable";
import { columns } from "@/components/polish/PolishColumn";

const PolishMaterials = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [polishMaterial, setPolishMaterial] = useState<materialType[]>([]);

  const getPolishMaterials = async () => {
    try {
      const res = await fetch("/api/polish", {
        method: "GET",
      });
      const data = await res.json();
      setPolishMaterial(data);
      setLoading(false);
    } catch (err) {
      console.log("[polish_GET]", err);
    }
  };

  useEffect(() => {
    getPolishMaterials();
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <div className="px-10 py-5">
      <div className="flex items-center justify-between">
        <p className="text-heading2-bold">Polish</p>
        <Button
          className="bg-blue-1 text-white"
          onClick={() => router.push("/polish/new")}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Polish Entry
        </Button>
      </div>
      <Separator className="bg-grey-1 my-4" />
      <DataTable columns={columns} data={polishMaterial} searchKey="title" />
    </div>
  );
};

export default PolishMaterials;
