import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoDB";
import Return from "@/lib/models/Return";

export const dynamic = "force-dynamic";

// GET Request to fetch all packaging entries
export const GET = async (req) => {
    try {
        await connectToDB();

        const returnData = await Return.find();

        return new NextResponse(JSON.stringify(returnData), { status: 200 });
    } catch (err) {
        console.log("[returnData_GET]", err);
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

        const newReturn = new Return({ date, entries });
        await newReturn.save();

        return new NextResponse("Return entry added successfully", { status: 201 });
    } catch (err) {
        console.log("[packaging_POST]", err);
        return new NextResponse("Internal Error", { status: 500 });
    }
};
