import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoDB";
import Packaging from "@/lib/models/Packaging";

export const GET = async (
    req: NextRequest,
    { params }: { params: { vendorName: string } }
) => {
    try {
        await connectToDB();

        const packagingEntries = await Packaging.find({
            'vendor': params.vendorName,
            'isCompleted': false,
        });

        if (!packagingEntries.length) {
            return NextResponse.json(
                packagingEntries,
                { status: 404 }
            );
        }

        return NextResponse.json(packagingEntries, { status: 200 });
    } catch (err) {
        console.log("[vendorName_GET]", err);
        return new NextResponse("Internal error", { status: 500 });
    }
};

export const dynamic = "force-dynamic";
