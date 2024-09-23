import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoDB";
import Return from "@/lib/models/Return";

export const GET = async (
    req: NextRequest,
    { params }: { params: { vendorId: string } }
) => {
    try {
        await connectToDB();

        const returnEntries = await Return.find({
            'products.vendor': params.vendorId,
        });

        if (!returnEntries.length) {
            return new NextResponse(
                JSON.stringify({ message: "No return data found for this vendor" }),
                { status: 404 }
            );
        }

        return NextResponse.json(returnEntries, { status: 200 });
    } catch (err) {
        console.log("[vendorId_GET]", err);
        return new NextResponse("Internal error", { status: 500 });
    }
};

export const dynamic = "force-dynamic";
