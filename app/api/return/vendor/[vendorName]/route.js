import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoDB";
import Return from "@/lib/models/Return";

export const dynamic = "force-dynamic";

// GET Request to fetch return entries for a specific vendor
export const GET = async (req, { params }) => {
    const { vendorName } = params;

    try {
        await connectToDB();

        // Fetch return entries for the given vendor name
        const returnEntries = await Return.find({
            "entries.vendor": vendorName,
        });

        // Process and organize the data
        const result = returnEntries.flatMap((ret) =>
            ret.entries
                .filter((entry) => entry.vendor === vendorName)
                .map((returnEntry) => ({
                    date: ret.date,
                    product: returnEntry.product,
                    returnedWeight: returnEntry.weight,
                    packets: returnEntry.packets,
                    rate: returnEntry.rate,
                    subtotal: (returnEntry.packets / 12) * returnEntry.rate,
                }))
        );

        // Calculate the total amount
        const totalAmount = result.reduce((sum, item) => sum + item.subtotal, 0);

        return NextResponse.json({ result, totalAmount }, { status: 200 });
    } catch (err) {
        console.log("[return_vendor_GET]", err);
        return new NextResponse("Internal Error", { status: 500 });
    }
};
