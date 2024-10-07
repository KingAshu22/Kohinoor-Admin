import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoDB";
import Packaging from "@/lib/models/Packaging";

interface ReturnObject {
    _id: string;
    date: string;
    weight: number;
    packets: number;
    gross: number;
    isVerified: boolean;
}

// POST Method - Create a new return entry
export const POST = async (req: NextRequest) => {
    try {
        await connectToDB();
        const requestBody = await req.json();
        console.log("Request Body:", requestBody);

        const {
            date,
            product,
            vendor,
            weight,
            packets,
            remainingWeight,
            gross,
        } = requestBody;

        const existingPackaging = await Packaging.findOne({
            product,
            vendor,
        });

        if (!existingPackaging) {
            return new NextResponse("No packaging found for the specified vendor and product.", {
                status: 404,
            });
        }

        // Prepare the return object to be pushed into the return array
        const returnEntry = {
            date,
            weight: Number(weight),
            packets: Number(packets),
            gross: Number(gross),
            isVerified: false,
        };

        // Add the new return entry to the return array
        existingPackaging.return.push(returnEntry);

        // Update the remaining weight
        existingPackaging.remainingWeight = remainingWeight;

        // Update the isCompleted flag based on the latest remainingWeight
        existingPackaging.isCompleted = remainingWeight === 0;

        // Save the updated entry
        await existingPackaging.save();

        return new NextResponse("Return entry processed successfully", { status: 200 });
    } catch (err) {
        console.error("[return_POST]", err);
        return new NextResponse("Internal Error", { status: 500 });
    }
};

// GET Method - Fetch all or specific vendor return entries
export const GET = async (req: NextRequest) => {
    try {
        await connectToDB();
        const { searchParams } = new URL(req.url);
        const vendorName = searchParams.get("vendorName");

        let returnData;
        if (vendorName) {
            returnData = await Packaging.find({ vendor: vendorName });
        } else {
            returnData = await Packaging.find();
        }

        return new NextResponse(JSON.stringify(returnData), { status: 200 });
    } catch (err) {
        console.error("[return_GET]", err);
        return new NextResponse("Internal Error", { status: 500 });
    }
};

// PUT Method - Update a specific return entry
export const PUT = async (req: NextRequest) => {
    try {
        await connectToDB();
        const requestBody = await req.json();
        const { packagingId, returnId, packets, gross } = requestBody;

        if (!packagingId || !returnId) {
            return new NextResponse("Packaging ID and Return ID are required", {
                status: 400,
            });
        }

        // Find the packaging entry by packagingId
        const packaging = await Packaging.findOne({ _id: packagingId });
        if (!packaging) {
            return new NextResponse("Packaging not found", { status: 404 });
        }

        // Find the specific return entry by returnId
        const returnEntry = packaging.return.id(returnId);
        if (!returnEntry) {
            return new NextResponse("Return entry not found", { status: 404 });
        }

        // Update the fields for the return entry
        returnEntry.packets = packets;
        returnEntry.gross = gross;

        // Save the updated packaging document
        await packaging.save();

        return new NextResponse("Return entry successfully updated", {
            status: 200,
        });
    } catch (err) {
        console.error("[return_PUT]", err);
        return new NextResponse("Internal Error", { status: 500 });
    }
};

// DELETE Method - Delete a specific return entry and update remainingWeight
export const DELETE = async (req: NextRequest) => {
    try {
        await connectToDB();

        const { productId, returnId } = await req.json();

        if (!productId || !returnId) {
            return new NextResponse("Product ID and Return ID are required", {
                status: 400,
            });
        }

        const packaging = await Packaging.findOne({ _id: productId });
        if (!packaging) {
            return new NextResponse("Product not found", { status: 404 });
        }

        // Filter out the return entry to be deleted
        const updatedReturns = packaging.return.filter(
            (ret: ReturnObject) => ret._id.toString() !== returnId
        );

        if (updatedReturns.length === packaging.return.length) {
            return new NextResponse("Return entry not found", { status: 404 });
        }

        // Calculate the total return weight after the deletion
        const totalReturnWeight = updatedReturns.reduce(
            (total: number, ret: ReturnObject) => total + ret.weight,
            0
        );

        // Sum up the total weight from the packaging array (if it's an array)
        const totalPackagingWeight = packaging.packaging.reduce(
            (total: number, pkg: { weight: number }) => total + pkg.weight,
            0
        );

        // Update the remainingWeight based on the updated return weights
        packaging.remainingWeight = totalPackagingWeight - totalReturnWeight;
        packaging.return = updatedReturns;

        await packaging.save();

        return new NextResponse("Return entry successfully deleted and remainingWeight updated", {
            status: 200,
        });
    } catch (err) {
        console.error("[return_DELETE]", err);
        return new NextResponse("Internal Error", { status: 500 });
    }
};

export const dynamic = "force-dynamic";
