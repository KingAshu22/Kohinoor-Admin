import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoDB";
import RawMaterial from "@/lib/models/RawMaterial";

export const POST = async (req: NextRequest) => {
    try {
        await connectToDB();

        const { date, products } = await req.json();

        if (!date || !products || !products.length) {
            return new NextResponse("Not enough data to create a Raw Material Entry", {
                status: 400,
            });
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

        const newRawMaterial = await RawMaterial.create({ date, products });

        await newRawMaterial.save();

        return new NextResponse(JSON.stringify(newRawMaterial), { status: 200 });
    } catch (err) {
        console.log("[rawMaterial_POST]", err);
        return new NextResponse("Internal Error", { status: 500 });
    }
};

export const GET = async (req: NextRequest) => {
    try {
        await connectToDB();

        const rawMaterial = await RawMaterial.find();

        return new NextResponse(JSON.stringify(rawMaterial), { status: 200 });
    } catch (err) {
        console.log("[rawMaterial_GET]", err);
        return new NextResponse("Internal Error", { status: 500 });
    }
};

export const dynamic = "force-dynamic";
