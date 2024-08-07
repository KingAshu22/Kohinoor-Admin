import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoDB";
import Box from "@/lib/models/Box";

export const GET = async (
    req: NextRequest,
    { params }: { params: { boxId: string } }
) => {
    try {
        await connectToDB();

        const box = await Box.findById(params.boxId);

        if (!box) {
            return new NextResponse(
                JSON.stringify({ message: "Box not found" }),
                { status: 404 }
            );
        }

        return NextResponse.json(box, { status: 200 });
    } catch (err) {
        console.log("[boxId_GET]", err);
        return new NextResponse("Internal error", { status: 500 });
    }
};

export const PUT = async (
    req: NextRequest,
    { params }: { params: { boxId: string } }
) => {
    try {
        await connectToDB();

        let box = await Box.findById(params.boxId);

        if (!box) {
            return new NextResponse("Box not found", { status: 404 });
        }

        const { date, products } = await req.json();

        if (!date || !products || !products.length) {
            return new NextResponse("Date and products array are required", { status: 400 });
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

        box = await Box.findByIdAndUpdate(
            params.boxId,
            { date, products },
            { new: true }
        );

        await box.save();

        return NextResponse.json(box, { status: 200 });
    } catch (err) {
        console.log("[boxId_PUT]", err);
        return new NextResponse("Internal error", { status: 500 });
    }
};

export const DELETE = async (
    req: NextRequest,
    { params }: { params: { boxId: string } }
) => {
    try {
        await connectToDB();

        await Box.findByIdAndDelete(params.boxId);

        return new NextResponse("Box is deleted", { status: 200 });
    } catch (err) {
        console.log("[boxId_DELETE]", err);
        return new NextResponse("Internal error", { status: 500 });
    }
};

export const dynamic = "force-dynamic";
