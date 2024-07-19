import mongoose from "mongoose";

const RawMaterialSchema = new mongoose.Schema({
    date: String,
    products: [{
        product: String,
        totalWeight: Number,
        partialWeight: Number,
        vendor: String,
        rate: Number,
        gross: Number,
        pieces: Number,
    }]
}, { toJSON: { getters: true } });

const RawMaterial = mongoose.models.RawMaterial || mongoose.model("RawMaterial", RawMaterialSchema);

export default RawMaterial;