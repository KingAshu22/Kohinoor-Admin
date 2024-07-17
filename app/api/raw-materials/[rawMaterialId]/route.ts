import { NextRequest, NextResponse } from "next/server";

import { connectToDB } from "@/lib/mongoDB";
import RawMaterial from "@/lib/models/RawMaterial";

export const GET = async (
    req: NextRequest,
    { params }: { params: { rawMaterialId: string } }
) => {
    try {
        await connectToDB();

        const rawMaterial = await RawMaterial.findById(params.rawMaterialId).sort({ expense: "asc" });

        if (!rawMaterial) {
            return new NextResponse(
                JSON.stringify({ message: "Raw Material not found" }),
                { status: 404 }
            );
        }

        return NextResponse.json(rawMaterial, { status: 200 });
    } catch (err) {
        console.log("[rawMaterialId_GET]", err);
        return new NextResponse("Internal error", { status: 500 });
    }
};

export const PUT = async (
    req: NextRequest,
    { params }: { params: { rawMaterialId: string } }
) => {
    try {
        await connectToDB();

        let rawMaterial = await RawMaterial.findById(params.rawMaterialId);

        if (!rawMaterial) {
            return new NextResponse("Raw Material not found", { status: 404 });
        }

        const { product, totalWeight, partialWeight, vendor, gross, pieces, date } = await req.json();

        if (!product || !totalWeight || !partialWeight || !vendor || !date) {
            return new NextResponse("Product, Total Weight, Partial Weight, Vendor, and Date are required", { status: 400 });
        }

        rawMaterial = await RawMaterial.findByIdAndUpdate(
            params.rawMaterialId,
            { product, totalWeight, partialWeight, vendor, gross, pieces, date },
            { new: true }
        );

        await rawMaterial.save();

        return NextResponse.json(rawMaterial, { status: 200 });
    } catch (err) {
        console.log("[rawMaterialId_PUT]", err);
        return new NextResponse("Internal error", { status: 500 });
    }
};

export const DELETE = async (
    req: NextRequest,
    { params }: { params: { rawMaterialId: string } }
) => {
    try {
        await connectToDB();

        await RawMaterial.findByIdAndDelete(params.rawMaterialId);

        return new NextResponse("Raw Material is deleted", { status: 200 });
    } catch (err) {
        console.log("[rawMaterialId_DELETE]", err);
        return new NextResponse("Internal error", { status: 500 });
    }
};

export const dynamic = "force-dynamic";
