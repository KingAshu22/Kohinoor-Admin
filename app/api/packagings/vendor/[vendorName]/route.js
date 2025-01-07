import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoDB";
import Packaging from "@/lib/models/Packaging";
import Return from "@/lib/models/Return";

export const dynamic = "force-dynamic";

// GET Request to fetch packaging and return data for a specific vendor
export const GET = async (req, { params }) => {
    const { vendorName } = params;

    try {
        await connectToDB();

        // Fetch packaging entries for the vendor
        const packagingEntries = await Packaging.find({
            "entries.vendor": vendorName,
        });

        // Fetch return entries for the vendor
        const returnEntries = await Return.find({
            "entries.vendor": vendorName,
        });

        // Combine and process data
        const result = packagingEntries.flatMap((packaging) =>
            packaging.entries
                .filter((entry) => entry.vendor === vendorName)
                .map((packagingEntry) => {
                    const relatedReturn = returnEntries.flatMap((ret) =>
                        ret.entries.filter((entry) => entry.product === packagingEntry.product)
                    );

                    // Calculate weight difference
                    const totalReturnedWeight = relatedReturn.reduce(
                        (sum, retEntry) => sum + retEntry.weight,
                        0
                    );
                    const weightDiff = packagingEntry.totalWeight - totalReturnedWeight; // Corrected field name

                    // Calculate amount
                    const totalPackets = relatedReturn.reduce(
                        (sum, retEntry) => sum + retEntry.packets,
                        0
                    );
                    const subtotal = (totalPackets / 12) * packagingEntry.rate; // Ensure correct field for rate

                    return {
                        product: packagingEntry.product,
                        packagingWeight: packagingEntry.totalWeight, // Corrected field name
                        returnedWeight: totalReturnedWeight,
                        weightDiff,
                        rate: packagingEntry.rate,
                        totalPackets,
                        subtotal,
                    };
                })
        );

        const totalAmount = result.reduce((sum, item) => sum + item.subtotal, 0);

        return NextResponse.json({ result, totalAmount }, { status: 200 });
    } catch (err) {
        console.log("[packaging_vendor_GET]", err);
        return new NextResponse("Internal Error", { status: 500 });
    }
};
