import mongoose from "mongoose";

const VendorSchema = new mongoose.Schema({
    name: String,
    type: String,
}, { toJSON: { getters: true } });

const Vendor = mongoose.models.Vendor || mongoose.model("Vendor", VendorSchema);

export default Vendor;