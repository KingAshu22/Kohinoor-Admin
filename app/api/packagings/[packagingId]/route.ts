import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoDB";
import Packaging from "@/lib/models/Packaging";

type Product = {
    product: string;
    totalWeight: number;
    partialWeight: number;
    vendor: string;
    rate: number;
    gross: number;
    pieces: number;
};

export const GET = async (
    req: NextRequest,
    { params }: { params: { packagingId: string } }
) => {
    try {
        await connectToDB();

        const packaging = await Packaging.findById(params.packagingId);

        if (!packaging) {
            return new NextResponse(
                JSON.stringify({ message: "Packaging not found" }),
                { status: 404 }
            );
        }

        return NextResponse.json(packaging, { status: 200 });
    } catch (err) {
        console.log("[packagingId_GET]", err);
        return new NextResponse("Internal error", { status: 500 });
    }
};

export const PUT = async (
    req: NextRequest,
    { params }: { params: { packagingId: string } }
) => {
    try {
        // Connect to the database
        await connectToDB();

        // Find existing packaging entry by ID
        const packaging = await Packaging.findById(params.packagingId);
        if (!packaging) {
            return new NextResponse("Packaging not found", { status: 404 });
        }

        // Extract and validate request data
        const { date, product, totalWeight, partialWeight, vendor, rate, gross, pieces }: {
            date: string;
            product: string;
            totalWeight: number;
            partialWeight: number;
            vendor: string;
            rate: number;
            gross: number;
            pieces: number;
        } = await req.json();

        console.log("Received Data:", {
            date,
            product,
            totalWeight,
            partialWeight,
            vendor,
            rate,
            gross,
            pieces
        });

        // Validate required fields
        if (
            !date ||
            !product ||
            totalWeight == null ||
            partialWeight == null ||
            !vendor ||
            rate == null ||
            gross == null ||
            pieces == null
        ) {
            return new NextResponse("All fields are required", { status: 400 });
        }

        // Update the packaging entry in the database
        packaging.date = date;
        packaging.products = [
            {
                product,
                totalWeight,
                partialWeight,
                vendor,
                rate,
                gross,
                pieces
            }
        ];

        await packaging.save();

        return NextResponse.json(packaging, { status: 200 });
    } catch (err) {
        console.error("[packagingId_PUT]", err);
        return new NextResponse("Internal error", { status: 500 });
    }
};

export const DELETE = async (
    req: NextRequest,
    { params }: { params: { packagingId: string } }
) => {
    try {
        await connectToDB();

        await Packaging.findByIdAndDelete(params.packagingId);

        return new NextResponse("Packaging is deleted", { status: 200 });
    } catch (err) {
        console.log("[packagingId_DELETE]", err);
        return new NextResponse("Internal error", { status: 500 });
    }
};

export const dynamic = "force-dynamic";
