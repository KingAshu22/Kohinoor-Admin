import { NextRequest, NextResponse } from "next/server";

import { connectToDB } from "@/lib/mongoDB";
import Color from "@/lib/models/Color";

export const POST = async (req: NextRequest) => {
    try {
        await connectToDB();

        const {
            product,
            totalWeight,
            partialWeight,
            gross,
            pieces,
            date,
        } = await req.json();

        if (!product || !totalWeight || !partialWeight || !gross || !pieces || !date) {
            return new NextResponse("Not enough data to create a Color Entry", {
                status: 400,
            });
        }

        const newColor = await Color.create({
            product,
            totalWeight,
            partialWeight,
            gross,
            pieces,
            date,
        });

        await newColor.save();

        return new NextResponse(JSON.stringify(newColor), { status: 200 });
    } catch (err) {
        console.log("[color_POST]", err);
        return new NextResponse("Internal Error", { status: 500 });
    }
};

export const GET = async (req: NextRequest) => {
    try {
        await connectToDB();

        const colors = await Color.find()

        return new NextResponse(JSON.stringify(colors), { status: 200 });
    } catch (err) {
        console.log("[color_GET]", err);
        return new NextResponse("Internal Error", { status: 500 });
    }
};

export const dynamic = "force-dynamic";
