import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoDB";
import Return from "@/lib/models/Return";

export const POST = async (req: NextRequest) => {
    try {
        await connectToDB();

        const { date, products } = await req.json();

        if (!date || !products || !products.length) {
            return new NextResponse("Not enough data to create a Return entry", {
                status: 400,
            });
        }

        const invalidProduct = products.some((product: any) =>
            !product.product ||
            !product.weight ||
            !product.remainingWeight ||
            !product.vendor ||
            !product.rate ||
            !product.gross ||
            !product.pieces
        );

        if (invalidProduct) {
            return new NextResponse("Incomplete product data", {
                status: 400,
            });
        }

        // Prepare the products with the correct types and isCompleted flag
        const updatedProducts = products.map((product: any) => ({
            product: product.product,
            vendor: product.vendor,
            rate: Number(product.rate),
            gross: Number(product.gross),
            pieces: Number(product.pieces),
            weight: Number(product.weight),
            remainingWeight: Number(product.remainingWeight),
            isCompleted: Number(product.remainingWeight) === 0, // true if remainingWeight is 0
        }));

        for (const product of updatedProducts) {
            // Check if the return already exists for the same vendor and product
            const existingReturn = await Return.findOne({
                "products.product": product.product,
                "products.vendor": product.vendor,
            });

            if (existingReturn) {
                // Find the specific product entry in the existing return
                const existingProduct = existingReturn.products.find((p: any) =>
                    p.product === product.product && p.vendor === product.vendor
                );

                if (existingProduct) {
                    // Accumulate the values for weight, gross, and pieces
                    existingProduct.weight += product.weight;
                    existingProduct.gross += product.gross;
                    existingProduct.pieces += product.pieces;

                    // Keep the remainingWeight as the latest value (don't accumulate)
                    existingProduct.remainingWeight = product.remainingWeight;

                    // Update the isCompleted flag based on the latest remainingWeight
                    existingProduct.isCompleted = product.remainingWeight === 0;
                }

                // Save the updated entry
                await existingReturn.save();
            } else {
                // Create a new return entry if none exists for this vendor and product
                const newReturn = new Return({
                    date,
                    products: [product],
                });
                await newReturn.save();
            }
        }

        return new NextResponse("Return entry processed successfully", { status: 200 });
    } catch (err) {
        console.error("[return_POST]", err);
        return new NextResponse("Internal Error", { status: 500 });
    }
};

export const GET = async (req: NextRequest) => {
    try {
        await connectToDB();

        const returnData = await Return.find();

        return new NextResponse(JSON.stringify(returnData), { status: 200 });
    } catch (err) {
        console.error("[return_GET]", err);
        return new NextResponse("Internal Error", { status: 500 });
    }
};

export const dynamic = "force-dynamic";
