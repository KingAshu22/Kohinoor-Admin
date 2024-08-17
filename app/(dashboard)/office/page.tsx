"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Plus } from "lucide-react";

import Loader from "@/components/custom ui/Loader";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/custom ui/DataTable";
import { columns } from "@/components/office/OfficeColumn";

const OfficeMaterials = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [officeMaterial, setOfficeMaterial] = useState<materialType[]>([]);

  const getOfficeMaterials = async () => {
    try {
      const res = await fetch("/api/office", {
        method: "GET",
      });
      const data = await res.json();
      setOfficeMaterial(data);
      setLoading(false);
    } catch (err) {
      console.log("[office_GET]", err);
    }
  };

  useEffect(() => {
    getOfficeMaterials();
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <div className="px-10 py-5">
      <div className="flex items-center justify-between">
        <p className="text-heading2-bold">Office Work</p>
        <Button
          className="bg-blue-1 text-white"
          onClick={() => router.push("/office/new")}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Work Entry
        </Button>
      </div>
      <Separator className="bg-grey-1 my-4" />
      <DataTable columns={columns} data={officeMaterial} searchKey="title" />
    </div>
  );
};

export default OfficeMaterials;
