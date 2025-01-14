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

        // Summarize totals by product
        const productSummary = {};

        // Process packaging entries
        packagingEntries.forEach((packaging) => {
            packaging.entries
                .filter((entry) => entry.vendor === vendorName)
                .forEach((packagingEntry) => {
                    const { product, totalWeight, rate } = packagingEntry;

                    if (!productSummary[product]) {
                        productSummary[product] = {
                            product,
                            packagingWeight: 0,
                            returnedWeight: 0,
                            rate,
                            totalPackets: 0,
                            subtotal: 0,
                        };
                    }

                    productSummary[product].packagingWeight += totalWeight;
                });
        });

        // Process return entries
        returnEntries.forEach((ret) => {
            ret.entries
                .filter((entry) => entry.vendor === vendorName)
                .forEach((returnEntry) => {
                    const { product, weight, packets } = returnEntry;

                    if (productSummary[product]) {
                        productSummary[product].returnedWeight += weight;
                        productSummary[product].totalPackets += packets;
                    }
                });
        });

        // Calculate weight difference and subtotal for each product
        const summaryArray = Object.values(productSummary).map((item) => {
            const weightDiff = item.packagingWeight - item.returnedWeight;
            const subtotal = (item.totalPackets / 12) * item.rate;

            return {
                ...item,
                weightDiff,
                subtotal,
            };
        });

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
