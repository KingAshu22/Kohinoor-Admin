import { NextRequest, NextResponse } from "next/server";

import { connectToDB } from "@/lib/mongoDB";
import Polish from "@/lib/models/Polish";

export const GET = async (
    req: NextRequest,
    { params }: { params: { polishMaterialId: string } }
) => {
    try {
        await connectToDB();

        const polishMaterial = await Polish.findById(params.polishMaterialId).sort({ expense: "asc" });

        if (!polishMaterial) {
            return new NextResponse(
                JSON.stringify({ message: "Polish Material not found" }),
                { status: 404 }
            );
        }

        return NextResponse.json(polishMaterial, { status: 200 });
    } catch (err) {
        console.log("[polishMaterialId_GET]", err);
        return new NextResponse("Internal error", { status: 500 });
    }
};

export const PUT = async (
    req: NextRequest,
    { params }: { params: { polishMaterialId: string } }
) => {
    try {
        await connectToDB();

        let polishMaterial = await Polish.findById(params.polishMaterialId);

        if (!polishMaterial) {
            return new NextResponse("Polish Material not found", { status: 404 });
        }

        const { product, totalWeight, partialWeight, vendor, gross, pieces, date } = await req.json();

        if (!product || !totalWeight || !partialWeight || !vendor || !date) {
            return new NextResponse("Product, Total Weight, Partial Weight, Vendor, and Date are required", { status: 400 });
        }

        polishMaterial = await Polish.findByIdAndUpdate(
            params.polishMaterialId,
            { product, totalWeight, partialWeight, vendor, gross, pieces, date },
            { new: true }
        );

        await polishMaterial.save();

        return NextResponse.json(polishMaterial, { status: 200 });
    } catch (err) {
        console.log("[polishMaterialId_PUT]", err);
        return new NextResponse("Internal error", { status: 500 });
    }
};

export const DELETE = async (
    req: NextRequest,
    { params }: { params: { polishMaterialId: string } }
) => {
    try {
        await connectToDB();

        await Polish.findByIdAndDelete(params.polishMaterialId);

        return new NextResponse("Polish Material is deleted", { status: 200 });
    } catch (err) {
        console.log("[polishMaterialId_DELETE]", err);
        return new NextResponse("Internal error", { status: 500 });
    }
};

export const dynamic = "force-dynamic";
