"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Plus } from "lucide-react";

import Loader from "@/components/custom ui/Loader";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/custom ui/DataTable";
import { columns } from "@/components/return/ReturnColumn";

const Returns = () => {
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [returnData, setReturnData] = useState<PackagingProductType[]>([]);

    const getReturn = async () => {
        try {
            const res = await fetch("/api/return", {
                method: "GET",
            });
            const data = await res.json();
            setReturnData(data);
            setLoading(false);
        } catch (err) {
            console.log("[setReturn_GET]", err);
        }
    };

    useEffect(() => {
        getReturn();
    }, []);

    return loading ? (
        <Loader />
    ) : (
        <div className="px-10 py-5">
            <div className="flex items-center justify-between">
                <p className="text-heading2-bold">Return</p>
                <Button
                    className="bg-blue-1 text-white"
                    onClick={() => router.push("/return/new")}
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Return Entry
                </Button>
            </div>
            <Separator className="bg-grey-1 my-4" />
            <DataTable columns={columns} data={returnData} searchKey="title" />
        </div>
    );
};

export default Returns;
