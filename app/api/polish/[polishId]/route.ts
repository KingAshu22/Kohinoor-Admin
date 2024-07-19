import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoDB";
import Polish from "@/lib/models/Polish";

export const GET = async (
    req: NextRequest,
    { params }: { params: { polishId: string } }
) => {
    try {
        await connectToDB();

        const polish = await Polish.findById(params.polishId);

        if (!polish) {
            return new NextResponse(
                JSON.stringify({ message: "Polish Entry not found" }),
                { status: 404 }
            );
        }

        return NextResponse.json(polish, { status: 200 });
    } catch (err) {
        console.log("[polishId_GET]", err);
        return new NextResponse("Internal error", { status: 500 });
    }
};

export const PUT = async (
    req: NextRequest,
    { params }: { params: { polishId: string } }
) => {
    try {
        await connectToDB();

        let polish = await Polish.findById(params.polishId);

        if (!polish) {
            return new NextResponse("Polish Entry not found", { status: 404 });
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

        polish = await Polish.findByIdAndUpdate(
            params.polishId,
            { date, products },
            { new: true }
        );

        await polish.save();

        return NextResponse.json(polish, { status: 200 });
    } catch (err) {
        console.log("[polishId_PUT]", err);
        return new NextResponse("Internal error", { status: 500 });
    }
};

export const DELETE = async (
    req: NextRequest,
    { params }: { params: { polishId: string } }
) => {
    try {
        await connectToDB();

        await Polish.findByIdAndDelete(params.polishId);

        return new NextResponse("Polish Entry is deleted", { status: 200 });
    } catch (err) {
        console.log("[polishId_DELETE]", err);
        return new NextResponse("Internal error", { status: 500 });
    }
};

export const dynamic = "force-dynamic";
