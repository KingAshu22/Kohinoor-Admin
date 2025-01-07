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
    const { packagingId } = params;

    try {
        // Connect to the database
        await connectToDB();

        const { date, entries } = await req.json();

        if (!date || !entries) {
            return new Response(
                JSON.stringify({ error: "Date and entries are required" }),
                { status: 400 }
            );
        }

        // Find the packaging by packagingId and update it
        const updatedPackaging = await Packaging.findByIdAndUpdate(
            packagingId,
            {
                date,
                entries,
            },
            { new: true } // Return the updated packaging
        );

        if (!updatedPackaging) {
            return new Response(
                JSON.stringify({ error: "Packaging not found" }),
                { status: 404 }
            );
        }

        return new Response(
            JSON.stringify({ message: "Packaging updated successfully", packaging: updatedPackaging }),
            { status: 200 }
        );
    } catch (err) {
        console.error("[PUT Packaging]", err);
        return new Response(
            JSON.stringify({ error: "An error occurred while updating packaging" }),
            { status: 500 }
        );
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
