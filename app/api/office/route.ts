import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoDB";
import Office from "@/lib/models/Office";

export const POST = async (req: NextRequest) => {
    try {
        await connectToDB();

        const { date, products } = await req.json();

        if (!date || !products || !products.length) {
            return new NextResponse("Not enough data to create a Office Entry", {
                status: 400,
            });
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

        const newOffice = await Office.create({ date, products });

        await newOffice.save();

        return new NextResponse(JSON.stringify(newOffice), { status: 200 });
    } catch (err) {
        console.log("[office_POST]", err);
        return new NextResponse("Internal Error", { status: 500 });
    }
};

export const GET = async (req: NextRequest) => {
    try {
        await connectToDB();

        const office = await Office.find();

        return new NextResponse(JSON.stringify(office), { status: 200 });
    } catch (err) {
        console.log("[office_GET]", err);
        return new NextResponse("Internal Error", { status: 500 });
    }
};

export const dynamic = "force-dynamic";
