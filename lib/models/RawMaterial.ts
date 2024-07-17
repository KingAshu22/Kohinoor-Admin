import mongoose from "mongoose";

const RawMaterialSchema = new mongoose.Schema({
    product: String,
    totalWeight: Number,
    partialWeight: Number,
    vendor: String,
    gross: Number,
    pieces: Number,
    date: String
}, { toJSON: { getters: true } });

const RawMaterial = mongoose.models.RawMaterial || mongoose.model("RawMaterial", RawMaterialSchema);

export default RawMaterial;