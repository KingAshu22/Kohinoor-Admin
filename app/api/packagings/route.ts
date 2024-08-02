import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoDB";
import Packaging from "@/lib/models/Packaging";

export const POST = async (req: NextRequest) => {
    try {
        await connectToDB();

        const { date, products } = await req.json();

        if (!date || !products || !products.length) {
            return new NextResponse("Not enough data to create a Packaging Entry", {
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

        const newPackaging = await Packaging.create({ date, products });

        await newPackaging.save();

        return new NextResponse(JSON.stringify(newPackaging), { status: 200 });
    } catch (err) {
        console.log("[packaging_POST]", err);
        return new NextResponse("Internal Error", { status: 500 });
    }
};

export const GET = async (req: NextRequest) => {
    try {
        await connectToDB();

        const packaging = await Packaging.find();

        return new NextResponse(JSON.stringify(packaging), { status: 200 });
    } catch (err) {
        console.log("[packaging_GET]", err);
        return new NextResponse("Internal Error", { status: 500 });
    }
};

export const dynamic = "force-dynamic";
