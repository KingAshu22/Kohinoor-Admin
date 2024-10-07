import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoDB";
import Packaging from "@/lib/models/Packaging";

export const POST = async (req: NextRequest) => {
    try {
        await connectToDB();

        const { date, product, totalWeight, partialWeight, vendor, rate, gross, pieces } = await req.json();

        if (!date || !product || !totalWeight || !partialWeight || !vendor || !rate || !gross || !pieces) {
            return new NextResponse("Not enough data to create a Packaging Entry", {
                status: 400,
            });
        }

        // Find if a packaging entry with the same vendor and product already exists
        const existingPackaging = await Packaging.findOne({ vendor, product });

        if (existingPackaging) {
            // If packaging exists, update it by adding the new packaging entry and updating totalWeight
            existingPackaging.packaging.push({
                date,
                weight: totalWeight,
                partialWeight,
                gross,
                pieces,
            });

            // Update the totalWeight and remainingWeight by adding the new weight
            existingPackaging.totalWeight += totalWeight;
            existingPackaging.remainingWeight += totalWeight;

            // Save the updated document
            await existingPackaging.save();

            return new NextResponse(JSON.stringify(existingPackaging), { status: 200 });
        } else {
            // If no packaging exists for the vendor and product, create a new entry
            const newPackaging = await Packaging.create({
                vendor,
                product,
                rate,
                totalWeight,
                remainingWeight: totalWeight,
                isCompleted: false,
                packaging: [{
                    date,
                    weight: totalWeight,
                    partialWeight,
                    gross,
                    pieces,
                }]
            });

            // Save the new packaging document
            await newPackaging.save();

            return new NextResponse(JSON.stringify(newPackaging), { status: 200 });
        }
    } catch (err) {
        console.error("[packaging_POST]", err);
        return new NextResponse("Internal Error", { status: 500 });
    }
};

export const GET = async (req: NextRequest) => {
    try {
        await connectToDB();

        const packaging = await Packaging.find();

        return new NextResponse(JSON.stringify(packaging), { status: 200 });
    } catch (err) {
        console.log("[packaging_GET]", err);
        return new NextResponse("Internal Error", { status: 500 });
    }
};

export const dynamic = "force-dynamic";
