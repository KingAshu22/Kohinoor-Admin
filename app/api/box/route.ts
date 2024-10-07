import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoDB";
import Packaging from "@/lib/models/Packaging";

// POST Method - Create a new boxing entry
export const POST = async (req: NextRequest) => {
    try {
        await connectToDB();
        const requestBody = await req.json();

        const {
            date,
            packagingId,
            packets,
            gross,
            boxCount,
            quantity,
        } = requestBody;

        // Corrected this line by passing packagingId directly
        const existingPackaging = await Packaging.findById(packagingId);

        if (!existingPackaging) {
            return new NextResponse("No packaging found for the specified vendor and product.", { status: 404 });
        }

        // Prepare the boxing object to be pushed into the box array
        const boxingEntry = {
            date,
            packets: Number(packets),
            gross: Number(gross),
            boxCount: String(boxCount),
            quantity: Number(quantity),
        };

        // Add the new boxing entry to the box array
        existingPackaging.box.push(boxingEntry);

        // Save the updated entry
        await existingPackaging.save();

        return new NextResponse("Boxing entry processed successfully", { status: 200 });
    } catch (err) {
        console.error("[boxing_POST]", err);
        return new NextResponse("Internal Error", { status: 500 });
    }
};

// GET Method - Fetch all or specific vendor boxing entries
export const GET = async (req: NextRequest) => {
    try {
        await connectToDB();
        const { searchParams } = new URL(req.url);
        const vendorName = searchParams.get("vendorName");

        let boxingData;
        if (vendorName) {
            boxingData = await Packaging.find({ vendor: vendorName });
        } else {
            boxingData = await Packaging.find();
        }

        return new NextResponse(JSON.stringify(boxingData), { status: 200 });
    } catch (err) {
        console.error("[boxing_GET]", err);
        return new NextResponse("Internal Error", { status: 500 });
    }
};

export const dynamic = "force-dynamic";
