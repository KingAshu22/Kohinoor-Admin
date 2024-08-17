import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoDB";
import Vendor from "@/lib/models/Vendor";
import RawMaterial from "@/lib/models/RawMaterial";
import Polish from "@/lib/models/Polish";
import Packaging from "@/lib/models/Packaging";
import Color from "@/lib/models/Color";
import Office from "@/lib/models/Office";

export const GET = async (
    req: NextRequest,
    { params }: { params: { vendorId: string } }
) => {
    try {
        await connectToDB();

        const vendor = await Vendor.findById(params.vendorId);

        if (!vendor) {
            return new NextResponse(
                JSON.stringify({ message: "Vendor not found" }),
                { status: 404 }
            );
        }

        const { searchParams } = new URL(req.url);
        const startDate = searchParams.get("startDate");
        const endDate = searchParams.get("endDate");

        if (!startDate || !endDate) {
            return new NextResponse(
                JSON.stringify({ message: "Start date and end date are required" }),
                { status: 400 }
            );
        }

        let results;

        switch (vendor.type) {
            case "Raw Material":
                results = await RawMaterial.find({
                    date: { $gte: startDate, $lte: endDate },
                    "products.vendor": vendor.name,
                });
                break;
            case "Polishing":
                results = await Polish.find({
                    date: { $gte: startDate, $lte: endDate },
                    "products.vendor": vendor.name,
                });
                break;
            case "Work From Home":
                results = await Packaging.find({
                    date: { $gte: startDate, $lte: endDate },
                    "products.vendor": vendor.name,
                });
                break;
            case "Work From Office":
                results = await Office.find({
                    date: { $gte: startDate, $lte: endDate },
                    "products.vendor": vendor.name,
                });
                break;
            default:
                return new NextResponse(
                    JSON.stringify({ message: "Invalid vendor type" }),
                    { status: 400 }
                );
        }

        return NextResponse.json(results, { status: 200 });
    } catch (err) {
        console.log("[vendorId_GET]", err);
        return new NextResponse("Internal error", { status: 500 });
    }
};
