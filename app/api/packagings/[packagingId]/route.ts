import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoDB";
import Packaging from "@/lib/models/Packaging";

export const GET = async (
    req: NextRequest,
    { params }: { params: { packagingId: string } }
) => {
    try {
        await connectToDB();

        const packaging = await Packaging.findById(params.packagingId);

        if (!packaging) {
            return new NextResponse(
                JSON.stringify({ message: "Packaging not found" }),
                { status: 404 }
            );
        }

        return NextResponse.json(packaging, { status: 200 });
    } catch (err) {
        console.log("[packagingId_GET]", err);
        return new NextResponse("Internal error", { status: 500 });
    }
};

export const PUT = async (
    req: NextRequest,
    { params }: { params: { packagingId: string } }
) => {
    try {
        await connectToDB();

        let packaging = await Packaging.findById(params.packagingId);

        if (!packaging) {
            return new NextResponse("Packaging not found", { status: 404 });
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

        packaging = await Packaging.findByIdAndUpdate(
            params.packagingId,
            { date, products },
            { new: true }
        );

        await packaging.save();

        return NextResponse.json(packaging, { status: 200 });
    } catch (err) {
        console.log("[packagingId_PUT]", err);
        return new NextResponse("Internal error", { status: 500 });
    }
};

export const DELETE = async (
    req: NextRequest,
    { params }: { params: { packagingId: string } }
) => {
    try {
        await connectToDB();

        await Packaging.findByIdAndDelete(params.packagingId);

        return new NextResponse("Packaging is deleted", { status: 200 });
    } catch (err) {
        console.log("[packagingId_DELETE]", err);
        return new NextResponse("Internal error", { status: 500 });
    }
};

export const dynamic = "force-dynamic";
