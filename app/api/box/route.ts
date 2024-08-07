import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoDB";
import Box from "@/lib/models/Box";

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
            !product.boxCount ||
            !product.quantity
        );

        if (invalidProduct) {
            return new NextResponse("Incomplete product data", {
                status: 400,
            });
        }

        const newBox = await Box.create({ date, products });

        await newBox.save();

        return new NextResponse(JSON.stringify(newBox), { status: 200 });
    } catch (err) {
        console.log("[box_POST]", err);
        return new NextResponse("Internal Error", { status: 500 });
    }
};

export const GET = async (req: NextRequest) => {
    try {
        await connectToDB();

        const box = await Box.find();

        return new NextResponse(JSON.stringify(box), { status: 200 });
    } catch (err) {
        console.log("[box_GET]", err);
        return new NextResponse("Internal Error", { status: 500 });
    }
};

export const dynamic = "force-dynamic";
