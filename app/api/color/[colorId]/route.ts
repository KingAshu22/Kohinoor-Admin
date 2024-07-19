import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoDB";
import Color from "@/lib/models/Color";

export const GET = async (
    req: NextRequest,
    { params }: { params: { colorId: string } }
) => {
    try {
        await connectToDB();

        const color = await Color.findById(params.colorId);

        if (!color) {
            return new NextResponse(
                JSON.stringify({ message: "Color Entry not found" }),
                { status: 404 }
            );
        }

        return NextResponse.json(color, { status: 200 });
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

        let color = await Color.findById(params.colorId);

        if (!color) {
            return new NextResponse("Color Entry not found", { status: 404 });
        }

        const { date, products } = await req.json();

        if (!date || !products || !products.length) {
            return new NextResponse("Date and products array are required", { status: 400 });
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

        color = await Color.findByIdAndUpdate(
            params.colorId,
            { date, products },
            { new: true }
        );

        await color.save();

        return NextResponse.json(color, { status: 200 });
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

        return new NextResponse("Color Entry is deleted", { status: 200 });
    } catch (err) {
        console.log("[collorId_DELETE]", err);
        return new NextResponse("Internal error", { status: 500 });
    }
};

export const dynamic = "force-dynamic";
