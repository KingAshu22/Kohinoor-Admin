import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoDB";
import Color from "@/lib/models/Color";

export const POST = async (req: NextRequest) => {
    try {
        await connectToDB();

        const { date, products } = await req.json();

        if (!date || !products || !products.length) {
            return new NextResponse("Not enough data to create a Color Entry", {
                status: 400,
            });
        }

        const invalidProduct = products.some((product: any) =>
            !product.product ||
            !product.totalWeight ||
            !product.partialWeight ||
            !product.gross ||
            !product.pieces
        );

        if (invalidProduct) {
            return new NextResponse("Incomplete product data", {
                status: 400,
            });
        }

        const newColor = await Color.create({ date, products });

        await newColor.save();

        return new NextResponse(JSON.stringify(newColor), { status: 200 });
    } catch (err) {
        console.log("[color_POST]", err);
        return new NextResponse("Internal Error", { status: 500 });
    }
};

export const GET = async (req: NextRequest) => {
    try {
        await connectToDB();

        const color = await Color.find();

        return new NextResponse(JSON.stringify(color), { status: 200 });
    } catch (err) {
        console.log("[color_GET]", err);
        return new NextResponse("Internal Error", { status: 500 });
    }
};

export const dynamic = "force-dynamic";
