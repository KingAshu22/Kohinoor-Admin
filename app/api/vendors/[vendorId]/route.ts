import { NextRequest, NextResponse } from "next/server";

import { connectToDB } from "@/lib/mongoDB";
import Vendor from "@/lib/models/Vendor";

export const GET = async (
    req: NextRequest,
    { params }: { params: { vendorId: string } }
) => {
    try {
        await connectToDB();

        const vendor = await Vendor.findById(params.vendorId).sort({ expense: "asc" });

        if (!vendor) {
            return new NextResponse(
                JSON.stringify({ message: "Vendor not found" }),
                { status: 404 }
            );
        }

        return NextResponse.json(vendor, { status: 200 });
    } catch (err) {
        console.log("[vendorId_GET]", err);
        return new NextResponse("Internal error", { status: 500 });
    }
};

export const PUT = async (
    req: NextRequest,
    { params }: { params: { vendorId: string } }
) => {
    try {
        await connectToDB();

        let vendor = await Vendor.findById(params.vendorId);

        if (!vendor) {
            return new NextResponse("Vendor not found", { status: 404 });
        }

        const { name, address, contact, rate, type } = await req.json();

        if (!name || !address || !contact || !rate || !type) {
            return new NextResponse("Name, Address, Contact, Rate and Type are required", { status: 400 });
        }

        vendor = await Vendor.findByIdAndUpdate(
            params.vendorId,
            { name, address, contact, rate, type },
            { new: true }
        );

        await vendor.save();

        return NextResponse.json(vendor, { status: 200 });
    } catch (err) {
        console.log("[vendorId_POST]", err);
        return new NextResponse("Internal error", { status: 500 });
    }
};

export const DELETE = async (
    req: NextRequest,
    { params }: { params: { vendorId: string } }
) => {
    try {
        await connectToDB();

        await Vendor.findByIdAndDelete(params.vendorId);;

        return new NextResponse("Vendor is deleted", { status: 200 });
    } catch (err) {
        console.log("[vendorId_DELETE]", err);
        return new NextResponse("Internal error", { status: 500 });
    }
};

export const dynamic = "force-dynamic";
