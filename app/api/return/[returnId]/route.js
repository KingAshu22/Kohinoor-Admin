import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoDB";
import Return from "@/lib/models/Return";

export const GET = async (
    req,
    { params }
) => {
    try {
        await connectToDB();

        const returnData = await Return.findById(params.returnId);

        if (!returnData) {
            return new NextResponse(
                JSON.stringify({ message: "Return not found" }),
                { status: 404 }
            );
        }

        return NextResponse.json(returnData, { status: 200 });
    } catch (err) {
        console.log("[returnData_GET]", err);
        return new NextResponse("Internal error", { status: 500 });
    }
};

export const PUT = async (
    req,
    { params }
) => {
    const { returnId } = params;

    try {
        // Connect to the database
        await connectToDB();

        const { date, entries } = await req.json();

        if (!date || !entries) {
            return new Response(
                JSON.stringify({ error: "Date and entries are required" }),
                { status: 400 }
            );
        }

        // Find the return by returnId and update it
        const updatedReturn = await Return.findByIdAndUpdate(
            returnId,
            {
                date,
                entries,
            },
            { new: true } // Return the updated return
        );

        if (!updatedReturn) {
            return new Response(
                JSON.stringify({ error: "Return not found" }),
                { status: 404 }
            );
        }

        return new Response(
            JSON.stringify({ message: "Return updated successfully", updatedReturn: updatedReturn }),
            { status: 200 }
        );
    } catch (err) {
        console.error("[PUT Return]", err);
        return new Response(
            JSON.stringify({ error: "An error occurred while updating return" }),
            { status: 500 }
        );
    }
};

export const DELETE = async (
    req,
    { params }
) => {
    try {
        await connectToDB();

        await Return.findByIdAndDelete(params.returnId);

        return new NextResponse("Return is deleted", { status: 200 });
    } catch (err) {
        console.log("[returnId_DELETE]", err);
        return new NextResponse("Internal error", { status: 500 });
    }
};

export const dynamic = "force-dynamic";
