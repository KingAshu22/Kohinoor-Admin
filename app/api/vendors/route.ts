import { NextRequest, NextResponse } from "next/server";

import { connectToDB } from "@/lib/mongoDB";
import Vendor from "@/lib/models/Vendor";

export const POST = async (req: NextRequest) => {
  try {
    await connectToDB();

    const {
      name,
      address,
      contact,
      rate,
      type
    } = await req.json();

    console.log(req.json);


    if (!name || !address || !contact || !rate || !type) {
      return new NextResponse("Not enough data to create a vendor", {
        status: 400,
      });
    }

    const newVendor = await Vendor.create({
      name,
      address,
      contact,
      rate,
      type
    });

    await newVendor.save();

    return new NextResponse(JSON.stringify(newVendor), { status: 200 });
  } catch (err) {
    console.log("[vendors_POST]", err);
    return new NextResponse("Internal Error", { status: 500 });
  }
};

export const GET = async (req: NextRequest) => {
  try {
    await connectToDB();

    const vendors = await Vendor.find()

    return new NextResponse(JSON.stringify(vendors), { status: 200 });
  } catch (err) {
    console.log("[vendors_GET]", err);
    return new NextResponse("Internal Error", { status: 500 });
  }
};

export const dynamic = "force-dynamic";
