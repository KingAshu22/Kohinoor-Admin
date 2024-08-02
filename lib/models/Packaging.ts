import mongoose from "mongoose";

const PackagingSchema = new mongoose.Schema({
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

const Packaging = mongoose.models.Packaging || mongoose.model("Packaging", PackagingSchema);

export default Packaging;