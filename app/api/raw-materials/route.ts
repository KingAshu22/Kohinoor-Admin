import { NextRequest, NextResponse } from "next/server";

import { connectToDB } from "@/lib/mongoDB";
import RawMaterial from "@/lib/models/RawMaterial";

export const POST = async (req: NextRequest) => {
    try {
        await connectToDB();

        const {
            product,
            totalWeight,
            partialWeight,
            vendor,
            gross,
            pieces,
            date,
        } = await req.json();

        console.log(req.json);


        if (!product || !totalWeight || !partialWeight || !vendor || !gross || !pieces || !date) {
            return new NextResponse("Not enough data to create a Raw Material Entry", {
                status: 400,
            });
        }

        const newRawMaterial = await RawMaterial.create({
            product,
            totalWeight,
            partialWeight,
            vendor,
            gross,
            pieces,
            date,
        });

        await newRawMaterial.save();

        return new NextResponse(JSON.stringify(newRawMaterial), { status: 200 });
    } catch (err) {
        console.log("[rawMaterial_POST]", err);
        return new NextResponse("Internal Error", { status: 500 });
    }
};

export const GET = async (req: NextRequest) => {
    try {
        await connectToDB();

        const rawMaterial = await RawMaterial.find()

        return new NextResponse(JSON.stringify(rawMaterial), { status: 200 });
    } catch (err) {
        console.log("[rawMaterial_GET]", err);
        return new NextResponse("Internal Error", { status: 500 });
    }
};

export const dynamic = "force-dynamic";
