"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Plus } from "lucide-react";

import Loader from "@/components/custom ui/Loader";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/custom ui/DataTable";
import { columns } from "@/components/packaging/PackagingColumn";

const Packagings = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [Packaging, setPackaging] = useState<materialType[]>([]);

  const getPackaging = async () => {
    try {
      const res = await fetch("/api/packagings", {
        method: "GET",
      });
      const data = await res.json();
      setPackaging(data);
      setLoading(false);
    } catch (err) {
      console.log("[packaging_GET]", err);
    }
  };

  useEffect(() => {
    getPackaging();
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <div className="px-10 py-5">
      <div className="flex items-center justify-between">
        <p className="text-heading2-bold">Packaging</p>
        <Button
          className="bg-blue-1 text-white"
          onClick={() => router.push("/packaging/new")}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Packaging Entry
        </Button>
      </div>
      <Separator className="bg-grey-1 my-4" />
      <DataTable columns={columns} data={Packaging} searchKey="title" />
    </div>
  );
};

export default Packagings;
