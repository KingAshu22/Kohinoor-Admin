import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoDB";
import Packaging from "@/lib/models/Packaging";

export const POST = async (req: NextRequest) => {
    try {
        await connectToDB();
        const requestBody = await req.json();
        console.log("Request Body:", requestBody);

        const {
            date,
            product,
            weight,
            remainingWeight,
            vendor,
            gross,
            pieces,
        } = requestBody;

        // if (!date || !product || !weight || !remainingWeight || !vendor || !gross || !pieces) {
        //     console.log("All data not present");
        //     return new NextResponse("Not enough data to create a Return entry", {
        //         status: 400,
        //     });
        // } else {
        //     console.log("All data present");

        // }

        // Check if the packaging exists for the vendor and product where isCompleted is false
        const existingPackaging = await Packaging.findOne({
            product,
            vendor,
            isCompleted: false,
        });

        console.log("Packaging", existingPackaging);


        if (!existingPackaging) {
            return new NextResponse("No packaging found for the specified vendor and product.", {
                status: 404,
            });
        } else {
            console.log("Package Exists")
        }

        // Prepare the return object to be pushed into the return array
        const returnEntry = {
            date: date,
            weight: Number(weight),
            gross: Number(gross),
            pieces: Number(pieces),
        };

        console.log(returnEntry);

        // Add the new return entry to the return array
        existingPackaging.return.push(returnEntry);

        console.log("Return Entry Pushed");

        // Update the remaining weight
        existingPackaging.remainingWeight = remainingWeight;

        console.log("Remaining Weight Added");

        // Update the isCompleted flag based on the latest remainingWeight
        existingPackaging.isCompleted = remainingWeight === 0;

        console.log("isCompleted updated");

        // Save the updated entry
        await existingPackaging.save();

        console.log("Packaging Updated");

        return new NextResponse("Return entry processed successfully", { status: 200 });
    } catch (err) {
        console.error("[return_POST]", err);
        return new NextResponse("Internal Error", { status: 500 });
    }
};

export const GET = async (req: NextRequest) => {
    try {
        await connectToDB();
        const returnData = await Packaging.find();
        return new NextResponse(JSON.stringify(returnData), { status: 200 });
    } catch (err) {
        console.error("[return_GET]", err);
        return new NextResponse("Internal Error", { status: 500 });
    }
};

export const dynamic = "force-dynamic";
