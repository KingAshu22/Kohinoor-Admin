import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoDB";
import Office from "@/lib/models/Office";

export const GET = async (
    req: NextRequest,
    { params }: { params: { officeId: string } }
) => {
    try {
        await connectToDB();

        const office = await Office.findById(params.officeId);

        if (!office) {
            return new NextResponse(
                JSON.stringify({ message: "Office Work Entry not found" }),
                { status: 404 }
            );
        }

        return NextResponse.json(office, { status: 200 });
    } catch (err) {
        console.log("[officeId_GET]", err);
        return new NextResponse("Internal error", { status: 500 });
    }
};

export const PUT = async (
    req: NextRequest,
    { params }: { params: { officeId: string } }
) => {
    try {
        await connectToDB();

        let office = await Office.findById(params.officeId);

        if (!office) {
            return new NextResponse("Office Work Entry not found", { status: 404 });
        }

        const { date, products } = await req.json();

        if (!date || !products || !products.length) {
            return new NextResponse("Date and products array are required", { status: 400 });
        }

        const invalidProduct = products.some((product: any) =>
            !product.product ||
            !product.vendor ||
            !product.sheetType ||
            !product.sheetCount ||
            !product.rate
        );

        if (invalidProduct) {
            return new NextResponse("Incomplete product data", {
                status: 400,
            });
        }

        office = await Office.findByIdAndUpdate(
            params.officeId,
            { date, products },
            { new: true }
        );

        await office.save();

        return NextResponse.json(office, { status: 200 });
    } catch (err) {
        console.log("[officeId_PUT]", err);
        return new NextResponse("Internal error", { status: 500 });
    }
};

export const DELETE = async (
    req: NextRequest,
    { params }: { params: { officeId: string } }
) => {
    try {
        await connectToDB();

        await Office.findByIdAndDelete(params.officeId);

        return new NextResponse("Office Work Entry is deleted", { status: 200 });
    } catch (err) {
        console.log("[officeId_DELETE]", err);
        return new NextResponse("Internal error", { status: 500 });
    }
};

export const dynamic = "force-dynamic";
