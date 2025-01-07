import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoDB";
import Packaging from "@/lib/models/Packaging";

export const dynamic = "force-dynamic";

// GET Request to fetch all packaging entries
export const GET = async (req) => {
    try {
        await connectToDB();

        const packaging = await Packaging.find();

        return new NextResponse(JSON.stringify(packaging), { status: 200 });
    } catch (err) {
        console.log("[packaging_GET]", err);
        return new NextResponse("Internal Error", { status: 500 });
    }
};

// POST Request to add a new packaging entry
export const POST = async (req) => {
    try {
        await connectToDB();

        const body = await req.json();
        console.log("Data:", body);
        const { date, entries } = body;

        if (!date || !entries || !Array.isArray(entries) || entries.length === 0) {
            return new NextResponse("Invalid request data", { status: 400 });
        }

        const newPackaging = new Packaging({ date, entries });
        await newPackaging.save();

        return new NextResponse("Packaging entry added successfully", { status: 201 });
    } catch (err) {
        console.log("[packaging_POST]", err);
        return new NextResponse("Internal Error", { status: 500 });
    }
};
