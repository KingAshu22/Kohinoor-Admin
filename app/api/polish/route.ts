import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoDB";
import Polish from "@/lib/models/Polish";

export const POST = async (req: NextRequest) => {
    try {
        await connectToDB();

        const { date, products } = await req.json();

        if (!date || !products || !products.length) {
            return new NextResponse("Not enough data to create a Polish Entry", {
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

        const newPolish = await Polish.create({ date, products });

        await newPolish.save();

        return new NextResponse(JSON.stringify(newPolish), { status: 200 });
    } catch (err) {
        console.log("[polish_POST]", err);
        return new NextResponse("Internal Error", { status: 500 });
    }
};

export const GET = async (req: NextRequest) => {
    try {
        await connectToDB();

        const polish = await Polish.find();

        return new NextResponse(JSON.stringify(polish), { status: 200 });
    } catch (err) {
        console.log("[polish_GET]", err);
        return new NextResponse("Internal Error", { status: 500 });
    }
};

export const dynamic = "force-dynamic";
