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

        const newPackaging = await Packaging.create({
            date,
            vendor,
            product,
            rate,
            remainingWeight: totalWeight,
            isCompleted: false,
            isVerified: false,
            packaging: {
                weight: totalWeight,
                partialWeight,
                gross,
                pieces,
            }
        });

        await newPackaging.save();

        return new NextResponse(JSON.stringify(newPackaging), { status: 200 });
    } catch (err) {
        console.log("[packaging_POST]", err);
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
