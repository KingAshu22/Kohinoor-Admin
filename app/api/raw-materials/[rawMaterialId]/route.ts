import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoDB";
import RawMaterial from "@/lib/models/RawMaterial";

export const GET = async (
    req: NextRequest,
    { params }: { params: { rawMaterialId: string } }
) => {
    try {
        await connectToDB();

        const rawMaterial = await RawMaterial.findById(params.rawMaterialId);

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

        const { date, products } = await req.json();

        if (!date || !products || !products.length) {
            return new NextResponse("Date and products array are required", { status: 400 });
        }

        const invalidProduct = products.some((product: any) =>
            !product.product ||
            !product.totalWeight ||
            !product.partialWeight ||
            !product.vendor ||
            !product.rate ||
            !product.gross ||
            !product.pieces
        );

        if (invalidProduct) {
            return new NextResponse("Incomplete product data", {
                status: 400,
            });
        }

        rawMaterial = await RawMaterial.findByIdAndUpdate(
            params.rawMaterialId,
            { date, products },
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
