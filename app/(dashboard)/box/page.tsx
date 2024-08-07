"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Plus } from "lucide-react";

import Loader from "@/components/custom ui/Loader";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/custom ui/DataTable";
import { columns } from "@/components/box/BoxColumn";

const Box = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [box, setBox] = useState<materialType[]>([]);

  const getBox = async () => {
    try {
      const res = await fetch("/api/box", {
        method: "GET",
      });
      const data = await res.json();
      setBox(data);
      setLoading(false);
    } catch (err) {
      console.log("[box_GET]", err);
    }
  };

  useEffect(() => {
    getBox();
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <div className="px-10 py-5">
      <div className="flex items-center justify-between">
        <p className="text-heading2-bold">Box</p>
        <Button
          className="bg-blue-1 text-white"
          onClick={() => router.push("/box/new")}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Box Entry
        </Button>
      </div>
      <Separator className="bg-grey-1 my-4" />
      <DataTable columns={columns} data={box} searchKey="title" />
    </div>
  );
};

export default Box;
