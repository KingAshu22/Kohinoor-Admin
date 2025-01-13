import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoDB";
import Box from "@/lib/models/Box"; // Changed to Box model

// POST Method - Create or update a boxing entry
export const POST = async (req: NextRequest) => {
    try {
        await connectToDB();
        const requestBody = await req.json();

        const { date, products } = requestBody;

        // Create a new box entry with the provided date and products
        const newBoxEntry = {
            date,
            products: products.map((product: { product: string; boxCount: number; quantity: string }) => ({
                product: product.product,
                boxCount: product.boxCount,
                quantity: product.quantity,
            })),
        };

        // Save the new boxing entry
        const box = new Box(newBoxEntry);
        await box.save();

        return new NextResponse("Boxing entry created successfully", { status: 200 });
    } catch (err) {
        console.error("[boxing_POST]", err);
        return new NextResponse("Internal Error", { status: 500 });
    }
};

// PUT Method - Update a boxing entry (edit existing entry)
export const PUT = async (req: NextRequest) => {
    try {
        await connectToDB();
        const requestBody = await req.json();
        const { _id, date, products } = requestBody;

        // Find and update the box entry by ID
        const existingBox = await Box.findById(_id);
        if (!existingBox) {
            return new NextResponse("Box entry not found", { status: 404 });
        }

        // Update the date and products of the box entry
        existingBox.date = date;
        existingBox.products = products.map((product: { product: string; boxCount: number; quantity: string }) => ({
            product: product.product,
            boxCount: product.boxCount,
            quantity: product.quantity,
        }));

        // Save the updated box entry
        await existingBox.save();

        return new NextResponse("Boxing entry updated successfully", { status: 200 });
    } catch (err) {
        console.error("[boxing_PUT]", err);
        return new NextResponse("Internal Error", { status: 500 });
    }
};

// GET Method - Fetch all or specific box entries
export const GET = async (req: NextRequest) => {
    try {
        await connectToDB();
        const { searchParams } = new URL(req.url);
        const vendorName = searchParams.get("vendorName");

        let boxData;
        if (vendorName) {
            // Filter by vendor name if provided (assuming vendorName exists in the Box schema)
            boxData = await Box.find({ "products.product": vendorName });
        } else {
            // Fetch all box entries if no vendorName is provided
            boxData = await Box.find();
        }

        return new NextResponse(JSON.stringify(boxData), { status: 200 });
    } catch (err) {
        console.error("[boxing_GET]", err);
        return new NextResponse("Internal Error", { status: 500 });
    }
};

export const dynamic = "force-dynamic";
