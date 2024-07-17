import { NextRequest, NextResponse } from "next/server";

import { connectToDB } from "@/lib/mongoDB";
import Color from "@/lib/models/Color";

export const GET = async (
    req: NextRequest,
    { params }: { params: { colorId: string } }
) => {
    try {
        await connectToDB();

        const colorMaterial = await Color.findById(params.colorId).sort({ expense: "asc" });

        if (!colorMaterial) {
            return new NextResponse(
                JSON.stringify({ message: "Color Material not found" }),
                { status: 404 }
            );
        }

        return NextResponse.json(colorMaterial, { status: 200 });
    } catch (err) {
        console.log("[colorId_GET]", err);
        return new NextResponse("Internal error", { status: 500 });
    }
};

export const PUT = async (
    req: NextRequest,
    { params }: { params: { colorId: string } }
) => {
    try {
        await connectToDB();

        let colorMaterial = await Color.findById(params.colorId);

        if (!colorMaterial) {
            return new NextResponse("Color Material not found", { status: 404 });
        }

        const { product, totalWeight, partialWeight, gross, pieces, date } = await req.json();

        if (!product || !totalWeight || !partialWeight || !date) {
            return new NextResponse("Product, Total Weight, Partial Weight, and Date are required", { status: 400 });
        }

        colorMaterial = await Color.findByIdAndUpdate(
            params.colorId,
            { product, totalWeight, partialWeight, gross, pieces, date },
            { new: true }
        );

        await colorMaterial.save();

        return NextResponse.json(colorMaterial, { status: 200 });
    } catch (err) {
        console.log("[colorId_PUT]", err);
        return new NextResponse("Internal error", { status: 500 });
    }
};

export const DELETE = async (
    req: NextRequest,
    { params }: { params: { colorId: string } }
) => {
    try {
        await connectToDB();

        await Color.findByIdAndDelete(params.colorId);

        return new NextResponse("Color Material is deleted", { status: 200 });
    } catch (err) {
        console.log("[colorId_DELETE]", err);
        return new NextResponse("Internal error", { status: 500 });
    }
};

export const dynamic = "force-dynamic";
