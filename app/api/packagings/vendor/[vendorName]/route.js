import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoDB";
import Packaging from "@/lib/models/Packaging";
import Return from "@/lib/models/Return";

export const dynamic = "force-dynamic";

// GET Request to fetch packaging and return data for a specific vendor
export const GET = async (req, { params }) => {
    const { vendorName } = params;

    // Parse the query parameters
    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    if (!startDate || !endDate) {
        return NextResponse.json(
            { error: "Both startDate and endDate are required" },
            { status: 400 }
        );
    }

    try {
        await connectToDB();

        // Fetch packaging entries for the vendor between the specified dates
        const packagingEntries = await Packaging.find({
            "entries.vendor": vendorName,
            date: { $gte: new Date(startDate), $lte: new Date(endDate) },
        });

        // Fetch return entries for the vendor between the specified dates
        const returnEntries = await Return.find({
            "entries.vendor": vendorName,
            date: { $gte: new Date(startDate), $lte: new Date(endDate) },
        });

        // Dates when products were taken from Packaging
        const packagingDates = packagingEntries.map((entry) => ({
            date: entry.date,
            entries: entry.entries.filter((e) => e.vendor === vendorName),
        }));

        // Dates when products were returned
        const returnDates = returnEntries.map((entry) => ({
            date: entry.date,
            entries: entry.entries.filter((e) => e.vendor === vendorName),
        }));

        // Summarized data for the bottom table
        const summarizedData = packagingEntries.flatMap((packaging) =>
            packaging.entries
                .filter((entry) => entry.vendor === vendorName)
                .map((packagingEntry) => {
                    const relatedReturn = returnEntries.flatMap((ret) =>
                        ret.entries.filter((entry) => entry.product === packagingEntry.product)
                    );

                    // Calculate total weight returned
                    const totalReturnedWeight = relatedReturn.reduce(
                        (sum, retEntry) => sum + retEntry.weight,
                        0
                    );

                    // Calculate weight difference
                    const weightDiff = packagingEntry.totalWeight - totalReturnedWeight;

                    // Calculate total packets
                    const totalPackets = relatedReturn.reduce(
                        (sum, retEntry) => sum + retEntry.packets,
                        0
                    );

                    // Calculate subtotal
                    const subtotal = (totalPackets / 12) * packagingEntry.rate;

                    return {
                        product: packagingEntry.product,
                        packagingWeight: packagingEntry.totalWeight,
                        returnedWeight: totalReturnedWeight,
                        weightDiff,
                        rate: packagingEntry.rate,
                        totalPackets,
                        subtotal,
                    };
                })
        );

        // Summarize totals for each product
        const summaryByProduct = summarizedData.reduce((acc, item) => {
            if (!acc[item.product]) {
                acc[item.product] = {
                    product: item.product,
                    packagingWeight: 0,
                    returnedWeight: 0,
                    weightDiff: 0,
                    totalPackets: 0,
                    rate: item.rate,
                    subtotal: 0,
                };
            }

            acc[item.product].packagingWeight += item.packagingWeight;
            acc[item.product].returnedWeight += item.returnedWeight;
            acc[item.product].weightDiff += item.weightDiff;
            acc[item.product].totalPackets += item.totalPackets;
            acc[item.product].subtotal += item.subtotal;

            return acc;
        }, {});

        const summaryArray = Object.values(summaryByProduct);

        // Calculate total of all subtotals
        const totalAmount = summaryArray.reduce((sum, item) => sum + item.subtotal, 0);

        return NextResponse.json(
            {
                packagingDates,
                returnDates,
                summary: summaryArray,
                totalAmount,
            },
            { status: 200 }
        );
    } catch (err) {
        console.log("[packaging_vendor_GET]", err);
        return new NextResponse("Internal Error", { status: 500 });
    }
};
